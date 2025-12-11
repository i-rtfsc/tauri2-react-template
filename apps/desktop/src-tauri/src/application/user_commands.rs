//! User command handlers - handles all write operations for users.

use std::sync::Arc;
use async_trait::async_trait;
use uuid::Uuid;
use crate::domain::cqrs::CommandHandler;
use crate::domain::users::{CreateUserCmd, DeleteUserCmd, IUserRepository, User};
use crate::error::AppError;

/// Handles user-related commands (write operations).
pub struct UserCommandHandler {
    repo: Arc<dyn IUserRepository>,
}

impl UserCommandHandler {
    pub fn new(repo: Arc<dyn IUserRepository>) -> Self {
        Self { repo }
    }
}

#[async_trait]
impl CommandHandler<CreateUserCmd, User> for UserCommandHandler {
    async fn handle(&self, cmd: CreateUserCmd) -> Result<User, AppError> {
        let user = User {
            id: Uuid::new_v4().to_string(),
            username: cmd.username,
            email: cmd.email,
            role: cmd.role,
            created_at: String::new(), // DB will set this
            updated_at: String::new(), // DB will set this
        };

        self.repo.create(user).await
    }
}

#[async_trait]
impl CommandHandler<DeleteUserCmd, ()> for UserCommandHandler {
    async fn handle(&self, cmd: DeleteUserCmd) -> Result<(), AppError> {
        self.repo.delete(&cmd.id).await
    }
}
