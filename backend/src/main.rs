use std::env;

use log::info;
use poem::{
    EndpointExt, Route, Server,
    endpoint::{StaticFileEndpoint, StaticFilesEndpoint},
    error::ResponseError,
    get, handler,
    http::StatusCode,
    listener::TcpListener,
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

#[derive(Debug, thiserror::Error)]
enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),
    #[error(transparent)]
    Sqlx(#[from] sqlx::Error),
    #[error(transparent)]
    Var(#[from] std::env::VarError),
    #[error(transparent)]
    Dotenv(#[from] dotenv::Error),
}

impl ResponseError for Error {
    fn status(&self) -> StatusCode {
        StatusCode::INTERNAL_SERVER_ERROR
    }
}

async fn init_pool() -> Result<SqlitePool, Error> {
    let pool = SqlitePool::connect(&env::var("DATABASE_URL")?).await?;
    Ok(pool)
}

#[derive(Serialize)]
struct CreateOnboardingSubmissionResponse {
    id: String,
}

#[handler]
async fn create_onboarding_submission(
    Data(pool): Data<&SqlitePool>,
) -> Result<Json<CreateOnboardingSubmissionResponse>, Error> {
    let id = Uuid::new_v4().to_string();

    sqlx::query!("INSERT INTO onboarding_submissions (id) VALUES (?)", id)
        .execute(pool)
        .await?;

    info!("Created onboarding submission");

    Ok(Json(CreateOnboardingSubmissionResponse { id }))
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct OnboardingSubmissionSummary {
    id: String,
    status: OnboardingSubmissionStatus,
    created_at: String,
}

#[handler]
async fn get_onboarding_submissions(
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

#[tokio::main]
async fn main() -> Result<(), Error> {
    dotenv::dotenv()?;
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    info!("Initialize db pool");
    let pool = init_pool().await?;
    let app = Route::new()
        .at(
            "/api/onboarding-submissions",
            get(get_onboarding_submissions).post(create_onboarding_submission),
        )
        .at("/favicon.ico", StaticFileEndpoint::new("www/favicon.ico"))
        .nest("/static/", StaticFilesEndpoint::new("www"))
        .at("*", StaticFileEndpoint::new("www/index.html"))
        .data(pool);
    Server::new(TcpListener::bind("0.0.0.0:3005"))
        .run(app)
        .await?;

    Ok(())
}
