// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod infra;
mod domain;
mod application;
mod interface;
mod error;

use tauri::{Manager, WindowEvent};
use tauri_plugin_window_state::{AppHandleExt, StateFlags};
use tracing::{info, error};
use std::sync::Arc;

// State wrapper to keep the file logger guard alive
struct LogGuardState(#[allow(dead_code)] infra::logging::WorkerGuard);

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        // 1. Window State (Auto save/restore position & size)
        .plugin(tauri_plugin_window_state::Builder::default().build())
        // 2. Single Instance Lock
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            let _ = app.get_webview_window("main").expect("no main window").set_focus();
        }))
        .setup(|app| {
            // 1. Initialize Logging
            let guard = infra::logging::setup_logging(app.handle())?;
            app.manage(LogGuardState(guard));

            // 2. Initialize Tray (Desktop Only)
            #[cfg(desktop)]
            {
                interface::tray::create_tray(app.handle())?;
            }

            // 3. Initialize HTTP Client
            let http_client = infra::http::HttpClient::new().expect("Failed to init HTTP client");
            app.manage(http_client);

            // 4. Initialize Database and CQRS Handlers (Async in setup)
            let app_handle = app.handle().clone();

            // Create Event Publisher (Infra)
            let publisher = Arc::new(infra::event_publisher::TauriEventPublisher::new(app_handle.clone()));

            tauri::async_runtime::block_on(async move {
                match infra::db::init_db(&app_handle).await {
                    Ok(pool) => {
                        info!("Database initialized successfully");
                        app_handle.manage(pool.clone());

                        // --- Config Domain (CQRS) ---
                        let config_repo = Arc::new(infra::repo_config::SqliteConfigRepository::new(pool.clone()));

                        // Command Handler (writes)
                        let config_cmd_handler = application::ConfigCommandHandler::new(
                            config_repo.clone(),
                            publisher.clone()
                        );
                        app_handle.manage(config_cmd_handler);

                        // Query Handler (reads)
                        let config_query_handler = application::ConfigQueryHandler::new(config_repo);
                        app_handle.manage(config_query_handler);

                        // --- User Domain (CQRS) ---
                        let user_repo = Arc::new(infra::repo_users::SqliteUserRepository::new(pool.clone()));

                        // Command Handler (writes)
                        let user_cmd_handler = application::UserCommandHandler::new(user_repo.clone());
                        app_handle.manage(user_cmd_handler);

                        // Query Handler (reads)
                        let user_query_handler = application::UserQueryHandler::new(user_repo);
                        app_handle.manage(user_query_handler);
                    }
                    Err(e) => {
                        error!("Failed to initialize database: {:?}", e);
                        panic!("Database initialization failed: {:?}", e);
                    }
                }
            });

            Ok(())
        })
        // Window event handling
        .on_window_event(|window, event| {
            match event {
                // Save state when window is resized or moved
                WindowEvent::Resized(_) | WindowEvent::Moved(_) => {
                    let _ = window.app_handle().save_window_state(StateFlags::all());
                }
                // Handle close request -> Hide to Tray
                WindowEvent::CloseRequested { api, .. } => {
                    if window.label() == "main" {
                        let _ = window.app_handle().save_window_state(StateFlags::all());

                        #[cfg(not(target_os = "macos"))]
                        {
                            let _ = window.hide();
                            api.prevent_close();
                        }
                    }
                }
                _ => {}
            }
        })
        .invoke_handler(tauri::generate_handler![
            interface::commands::greet,
            interface::commands::log_frontend_message,
            interface::commands::open_log_folder,
            interface::commands::check_db_health,
            interface::commands::get_app_setting,
            interface::commands::set_app_setting,
            interface::commands::get_all_settings,
            interface::commands::http_request,
            interface::commands::create_user,
            interface::commands::list_users,
            interface::commands::delete_user
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
