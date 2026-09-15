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
    answers: String,
    current_step: Option<String>,
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
            answers as "answers!",
            current_step
        FROM onboarding_submissions
        WHERE id = ?
        "#,
        id
    )
    .fetch_one(pool)
    .await?;

    let details = OnboardingSubmissionDetails {
        id: row.id,
        status: row.status,
        created_at: row.created_at,
        answers: row.answers,
        current_step: row.current_step,
    };

    info!("Fetched onboarding submission by id");

    Ok(Json(details))
}

pub fn routes() -> Route {
    Route::new()
        .at("/", get(list).post(create))
        .at("/:id", get(get_by_id))
}
