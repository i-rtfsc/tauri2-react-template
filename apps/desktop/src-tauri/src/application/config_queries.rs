//! Config query handlers - handles all read operations for config.

use std::collections::HashMap;
use std::sync::Arc;
use async_trait::async_trait;
use crate::domain::cqrs::QueryHandler;
use crate::domain::config::{GetAllConfigQuery, GetConfigQuery, IConfigRepository};
use crate::error::AppError;

/// Handles config-related queries (read operations).
pub struct ConfigQueryHandler {
    repo: Arc<dyn IConfigRepository>,
}

impl ConfigQueryHandler {
    pub fn new(repo: Arc<dyn IConfigRepository>) -> Self {
        Self { repo }
    }
}

#[async_trait]
impl QueryHandler<GetConfigQuery, Option<String>> for ConfigQueryHandler {
    async fn handle(&self, query: GetConfigQuery) -> Result<Option<String>, AppError> {
        self.repo.get(&query.key).await
    }
}

#[async_trait]
impl QueryHandler<GetAllConfigQuery, HashMap<String, String>> for ConfigQueryHandler {
    async fn handle(&self, _query: GetAllConfigQuery) -> Result<HashMap<String, String>, AppError> {
        self.repo.get_all().await
    }
}
