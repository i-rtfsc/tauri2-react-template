//! User query handlers - handles all read operations for users.

use std::sync::Arc;
use async_trait::async_trait;
use crate::domain::cqrs::QueryHandler;
use crate::domain::users::{GetUserByIdQuery, IUserRepository, ListUsersQuery, User};
use crate::error::AppError;

/// Handles user-related queries (read operations).
pub struct UserQueryHandler {
    repo: Arc<dyn IUserRepository>,
}

impl UserQueryHandler {
    pub fn new(repo: Arc<dyn IUserRepository>) -> Self {
        Self { repo }
    }
}

#[async_trait]
impl QueryHandler<ListUsersQuery, Vec<User>> for UserQueryHandler {
    async fn handle(&self, _query: ListUsersQuery) -> Result<Vec<User>, AppError> {
        self.repo.list().await
    }
}

#[async_trait]
impl QueryHandler<GetUserByIdQuery, Option<User>> for UserQueryHandler {
    async fn handle(&self, query: GetUserByIdQuery) -> Result<Option<User>, AppError> {
        self.repo.find_by_id(&query.id).await
    }
}
