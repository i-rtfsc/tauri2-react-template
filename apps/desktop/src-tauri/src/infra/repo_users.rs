use async_trait::async_trait;
use sqlx::SqlitePool;
use crate::domain::users::{IUserRepository, User};
use crate::error::AppError;

pub struct SqliteUserRepository {
    pool: SqlitePool,
}

impl SqliteUserRepository {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl IUserRepository for SqliteUserRepository {
    async fn create(&self, user: User) -> Result<User, AppError> {
        sqlx::query("INSERT INTO users (id, username, email, role, created_at, updated_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)")
            .bind(&user.id)
            .bind(&user.username)
            .bind(&user.email)
            .bind("user") // Default role or from struct if we add it column
            .execute(&self.pool)
            .await?;
        
        // Fetch back to get timestamps
        let created: User = sqlx::query_as("SELECT * FROM users WHERE id = ?")
            .bind(&user.id)
            .fetch_one(&self.pool)
            .await?;

        Ok(created)
    }

    async fn list(&self) -> Result<Vec<User>, AppError> {
        let users = sqlx::query_as::<_, User>("SELECT * FROM users ORDER BY created_at DESC")
            .fetch_all(&self.pool)
            .await?;
        Ok(users)
    }

    async fn find_by_id(&self, id: &str) -> Result<Option<User>, AppError> {
        let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = ?")
            .bind(id)
            .fetch_optional(&self.pool)
            .await?;
        Ok(user)
    }

    async fn delete(&self, id: &str) -> Result<(), AppError> {
        let result = sqlx::query("DELETE FROM users WHERE id = ?")
            .bind(id)
            .execute(&self.pool)
            .await?;
            
        if result.rows_affected() == 0 {
            return Err(AppError::NotFound(format!("User {} not found", id)));
        }
        Ok(())
    }
}
