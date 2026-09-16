use poem::{Response, error::ResponseError, http::StatusCode};

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),
    #[error(transparent)]
    Sqlx(#[from] sqlx::Error),
    #[error(transparent)]
    Var(#[from] std::env::VarError),
    #[error(transparent)]
    Dotenv(#[from] dotenv::Error),
    #[error(transparent)]
    Json(#[from] serde_json::Error),
    #[error("Submission not found")]
    NotFound,
    #[error("Submission already submitted")]
    AlreadySubmitted,
}

impl ResponseError for Error {
    fn status(&self) -> StatusCode {
        match self {
            Error::NotFound => StatusCode::NOT_FOUND,
            Error::AlreadySubmitted => StatusCode::CONFLICT,
            _ => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }

    fn as_response(&self) -> Response {
        match self {
            Error::NotFound | Error::AlreadySubmitted => log::info!("{self}"),
            _ => log::error!("{self}"),
        }

        let message = match self {
            Error::NotFound => self.to_string(),
            Error::AlreadySubmitted => self.to_string(),
            _ => "Internal server error".to_string(),
        };

        Response::builder().status(self.status()).body(message)
    }
}
