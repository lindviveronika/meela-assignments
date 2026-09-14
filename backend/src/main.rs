use crate::error::Error;
use log::info;
use poem::{
    EndpointExt, Route, Server,
    endpoint::{StaticFileEndpoint, StaticFilesEndpoint},
    listener::TcpListener,
};
use sqlx::SqlitePool;
use std::env;

mod error;
mod onboarding_submissions;

async fn init_pool() -> Result<SqlitePool, Error> {
    let pool = SqlitePool::connect(&env::var("DATABASE_URL")?).await?;
    Ok(pool)
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    dotenv::dotenv()?;
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    info!("Initialize db pool");
    let pool = init_pool().await?;
    let app = Route::new()
        .nest(
            "/api/onboarding-submissions",
            onboarding_submissions::routes(),
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
