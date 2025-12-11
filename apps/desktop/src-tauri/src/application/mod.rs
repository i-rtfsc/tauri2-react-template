// CQRS Handlers
pub mod config_commands;
pub mod config_queries;
pub mod user_commands;
pub mod user_queries;

// Re-exports for convenience
pub use config_commands::ConfigCommandHandler;
pub use config_queries::ConfigQueryHandler;
pub use user_commands::UserCommandHandler;
pub use user_queries::UserQueryHandler;
