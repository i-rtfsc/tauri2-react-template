use tauri::{AppHandle, Manager, State};
use tracing::info;
use std::collections::HashMap;
use std::process::Command;
use crate::infra::logging::LogPayload;
use crate::error::AppError;
use crate::application::{
    ConfigCommandHandler, ConfigQueryHandler,
    UserCommandHandler, UserQueryHandler,
};
use crate::domain::cqrs::{CommandHandler, QueryHandler};
use crate::domain::users::{CreateUserCmd, DeleteUserCmd, ListUsersQuery, User};
use crate::domain::config::{GetAllConfigQuery, GetConfigQuery, SetConfigCmd};
use crate::infra::http::{HttpClient, HttpRequest, HttpResponse};

#[cfg(target_os = "macos")]
const OPEN_LOG_COMMAND: &str = "open";
#[cfg(target_os = "windows")]
const OPEN_LOG_COMMAND: &str = "explorer";
#[cfg(target_os = "linux")]
const OPEN_LOG_COMMAND: &str = "xdg-open";
#[cfg(not(any(target_os = "macos", target_os = "windows", target_os = "linux")))]
const OPEN_LOG_COMMAND: &str = "open";

// Example Command
#[tauri::command]
pub async fn greet(name: String) -> Result<String, String> {
    info!(target: "app::greet", "Greeting requested for: {}", name);
    Ok(format!("Hello, {}! Welcome to Tauri + React!", name))
}

// Logging Command
#[tauri::command]
pub fn log_frontend_message(payload: LogPayload) {
    crate::infra::logging::log_frontend_message(payload);
}

// Log folder command
#[tauri::command]
pub async fn open_log_folder(app: AppHandle) -> Result<(), AppError> {
    let log_dir = app
        .path()
        .app_log_dir()
        .map_err(|e| AppError::Io(e.to_string()))?;

    if !log_dir.exists() {
        std::fs::create_dir_all(&log_dir).map_err(|e| AppError::Io(e.to_string()))?;
    }

    let status = Command::new(OPEN_LOG_COMMAND)
        .arg(log_dir.to_string_lossy().to_string())
        .status()
        .map_err(|e| AppError::Io(e.to_string()))?;

    if !status.success() {
        return Err(AppError::Io(format!(
            "Failed to open log directory (status: {:?})",
            status.code()
        )));
    }

    Ok(())
}

// Database Check Command
#[tauri::command]
pub async fn check_db_health(pool: State<'_, sqlx::SqlitePool>) -> Result<String, AppError> {
    let result: (i32,) = sqlx::query_as("SELECT 1")
        .fetch_one(pool.inner())
        .await?;

    Ok(format!("Database is healthy! Result: {}", result.0))
}

// --- Configuration Commands (CQRS) ---

#[tauri::command]
pub async fn get_app_setting(
    handler: State<'_, ConfigQueryHandler>,
    key: String,
) -> Result<Option<String>, AppError> {
    handler.handle(GetConfigQuery { key }).await
}

#[tauri::command]
pub async fn set_app_setting(
    handler: State<'_, ConfigCommandHandler>,
    key: String,
    value: String,
) -> Result<(), AppError> {
    handler.handle(SetConfigCmd { key, value }).await
}

#[tauri::command]
pub async fn get_all_settings(
    handler: State<'_, ConfigQueryHandler>,
) -> Result<HashMap<String, String>, AppError> {
    handler.handle(GetAllConfigQuery).await
}

// --- Network Commands ---

#[tauri::command]
pub async fn http_request(
    client: State<'_, HttpClient>,
    request: HttpRequest,
) -> Result<HttpResponse, AppError> {
    client.execute(request).await
}

// --- User Domain Commands (CQRS) ---

#[tauri::command]
pub async fn create_user(
    handler: State<'_, UserCommandHandler>,
    cmd: CreateUserCmd,
) -> Result<User, AppError> {
    handler.handle(cmd).await
}

#[tauri::command]
pub async fn list_users(
    handler: State<'_, UserQueryHandler>,
) -> Result<Vec<User>, AppError> {
    handler.handle(ListUsersQuery).await
}

#[tauri::command]
pub async fn delete_user(
    handler: State<'_, UserCommandHandler>,
    id: String,
) -> Result<(), AppError> {
    handler.handle(DeleteUserCmd { id }).await
}
