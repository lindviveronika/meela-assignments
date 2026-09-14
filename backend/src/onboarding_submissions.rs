use crate::error::Error;
use log::info;
use poem::{
    Route, get, handler,
    web::{Data, Json},
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
            created_at as "created_at!"
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
        })
        .collect();

    info!("Fetched onboarding submissions");

    Ok(Json(summaries))
}

pub fn routes() -> Route {
    Route::new().at("/", get(list).post(create))
}
