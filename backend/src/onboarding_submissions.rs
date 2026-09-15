use crate::error::Error;
use log::info;
use poem::{
    Route, get, handler,
    web::{Data, Json, Path},
};
use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
#[serde(rename_all = "lowercase")]
#[sqlx(rename_all = "lowercase")]
enum OnboardingSubmissionStatus {
    Draft,
    Submitted,
}

#[derive(Serialize)]
struct CreateOnboardingSubmissionResponse {
    id: String,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct OnboardingSubmissionSummary {
    id: String,
    status: OnboardingSubmissionStatus,
    created_at: String,
    current_step: Option<String>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct OnboardingSubmissionDetails {
    id: String,
    status: OnboardingSubmissionStatus,
    created_at: String,
    updated_at: String,
    answers: serde_json::Value,
    current_step: Option<String>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct UpdateOnboardingSubmissionRequest {
    answers: serde_json::Value,
    current_step: String,
}

#[handler]
async fn create(
    Data(pool): Data<&SqlitePool>,
) -> Result<Json<CreateOnboardingSubmissionResponse>, Error> {
    let id = Uuid::new_v4().to_string();

    sqlx::query!("INSERT INTO onboarding_submissions (id) VALUES (?)", id)
        .execute(pool)
        .await?;

    info!("Created onboarding submission");

    Ok(Json(CreateOnboardingSubmissionResponse { id }))
}

#[handler]
async fn list(
    Data(pool): Data<&SqlitePool>,
) -> Result<Json<Vec<OnboardingSubmissionSummary>>, Error> {
    let rows = sqlx::query!(
        r#"
        SELECT
            id as "id!",
            status as "status: OnboardingSubmissionStatus",
            created_at as "created_at!",
            current_step
        FROM onboarding_submissions
        ORDER BY created_at DESC
        "#
    )
    .fetch_all(pool)
    .await?;

    let summaries = rows
        .into_iter()
        .map(|row| OnboardingSubmissionSummary {
            id: row.id,
            status: row.status,
            created_at: row.created_at,
            current_step: row.current_step,
        })
        .collect();

    info!("Fetched onboarding submissions");

    Ok(Json(summaries))
}

#[handler]
async fn get_by_id(
    Data(pool): Data<&SqlitePool>,
    Path(id): Path<String>,
) -> Result<Json<OnboardingSubmissionDetails>, Error> {
    let row = sqlx::query!(
        r#"
        SELECT
            id as "id!",
            status as "status: OnboardingSubmissionStatus",
            created_at as "created_at!",
            updated_at as "updated_at!",
            answers as "answers!",
            current_step
        FROM onboarding_submissions
        WHERE id = ?
        "#,
        id
    )
    .fetch_optional(pool)
    .await?
    .ok_or(Error::NotFound)?;

    let details = OnboardingSubmissionDetails {
        id: row.id,
        status: row.status,
        created_at: row.created_at,
        answers: serde_json::from_str(&row.answers)?,
        current_step: row.current_step,
        updated_at: row.updated_at,
    };

    info!("Fetched onboarding submission by id");

    Ok(Json(details))
}

#[handler]
async fn update(
    Data(pool): Data<&SqlitePool>,
    Path(id): Path<String>,
    Json(payload): Json<UpdateOnboardingSubmissionRequest>,
) -> Result<Json<OnboardingSubmissionDetails>, Error> {
    let updated = sqlx::query!(
        r#"
        UPDATE onboarding_submissions
        SET answers = ?,
            current_step = ?,
            updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
        WHERE id = ? and status = 'draft'
        RETURNING
            id as "id!",
            status as "status: OnboardingSubmissionStatus",
            created_at as "created_at!",
            updated_at as "updated_at!",
            answers as "answers!",
            current_step
        "#,
        payload.answers,
        payload.current_step,
        id
    )
    .fetch_optional(pool)
    .await?;

    let Some(updated) = updated else {
        let exists = sqlx::query!(
            r#"
            SELECT id
            FROM onboarding_submissions
            WHERE id = ?
            "#,
            id
        )
        .fetch_optional(pool)
        .await?;

        if exists.is_none() {
            return Err(Error::NotFound);
        } else {
            return Err(Error::AlreadySubmitted);
        }
    };

    let details = OnboardingSubmissionDetails {
        id: updated.id,
        status: updated.status,
        created_at: updated.created_at,
        updated_at: updated.updated_at,
        answers: serde_json::from_str(&updated.answers)?,
        current_step: updated.current_step,
    };

    info!("Updated onboarding submission");

    Ok(Json(details))
}

pub fn routes() -> Route {
    Route::new()
        .at("/", get(list).post(create))
        .at("/:id", get(get_by_id).patch(update))
}
