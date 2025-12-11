use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use crate::error::AppError;
use crate::domain::cqrs::{Command, Query};

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct User {
    pub id: String,
    pub username: String,
    pub email: Option<String>,
    pub role: String, // "admin", "user"
    pub created_at: String, // ISO 8601 string from SQLite
    pub updated_at: String,
}

// ============ Commands ============

/// Command to create a new user
#[derive(Debug, Deserialize)]
pub struct CreateUserCmd {
    pub username: String,
    pub email: Option<String>,
    pub role: String,
}

impl Command for CreateUserCmd {}

/// Command to delete a user by ID
#[derive(Debug, Deserialize)]
pub struct DeleteUserCmd {
    pub id: String,
}

impl Command for DeleteUserCmd {}

// ============ Queries ============

/// Query to list all users
#[derive(Debug)]
pub struct ListUsersQuery;

impl Query for ListUsersQuery {}

/// Query to get a user by ID
#[derive(Debug)]
pub struct GetUserByIdQuery {
    pub id: String,
}

impl Query for GetUserByIdQuery {}

// ============ Repository ============

#[async_trait]
pub trait IUserRepository: Send + Sync {
    async fn create(&self, user: User) -> Result<User, AppError>;
    async fn list(&self) -> Result<Vec<User>, AppError>;
    async fn find_by_id(&self, id: &str) -> Result<Option<User>, AppError>;
    async fn delete(&self, id: &str) -> Result<(), AppError>;
}
