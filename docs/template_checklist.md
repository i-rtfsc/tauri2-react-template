# Template Checklist

Verify these baseline capabilities before starting your development.

## Project Structure
- [x] `apps/desktop` runs (React + Tauri)
- [x] `packages/{core,types,ui}` exist as shared package placeholders
- [x] `docs/` contains up-to-date documentation
- [x] `Makefile` commands match README description

## Frontend (React)
- [x] MainLayout / Sidebar / TopBar / PageContainer render correctly
- [x] Home / Users / Settings / ComponentShowcase pages accessible
- [x] Theme and language switching works
- [x] TanStack Query `useUsers` can load, create, and delete users
- [x] i18n dictionaries (zh-CN / en-US) match UI content

## Backend (Rust)
- [x] SQLite migrations run automatically, database in app data directory
- [x] `UserCommandHandler` / `UserQueryHandler` accessible via Tauri commands
- [x] `ConfigCommandHandler` / `ConfigQueryHandler` accessible via Tauri commands
- [x] `open_log_folder` opens the correct log directory
- [x] `check_db_health` command returns health status
- [x] Logs written to `app.log` on startup

## CQRS Architecture
- [x] Command/Query traits defined in `domain/cqrs.rs`
- [x] User domain uses `CreateUserCmd`, `DeleteUserCmd`, `ListUsersQuery`, `GetUserByIdQuery`
- [x] Config domain uses `SetConfigCmd`, `GetConfigQuery`
- [x] CommandHandlers and QueryHandlers separated in `application/` layer
- [x] Repository interfaces defined in domain, implemented in infrastructure

## Documentation
- [x] README / README_EN accurately describe the project
- [x] `docs/getting_started.md` reflects latest commands
- [x] `docs/architecture/architecture_overview.md` explains DDD + CQRS layers
- [x] `docs/zh & en/development.md` cover daily development workflow

## Verification Steps

```bash
# 1. Install dependencies
make install

# 2. Start development mode
make dev

# 3. Run production build
make build

# 4. Backend check
cd apps/desktop/src-tauri && cargo check
```

### Interactive Testing

1. On Users page, create a user (verify SQLite write)
2. Delete the same user (verify TanStack Query cache refresh)
3. On Settings page, click "Open Log Folder" and confirm directory opens
4. Click "Database Health Check" button, verify success toast
5. Switch language to EN then back to ZH, confirm text updates
6. Resize window, restart app, verify window state persists

## Optional Extensions
- [ ] Export shared packages (packages/ui) and import in frontend
- [ ] Add more domain aggregates and extend commands
- [ ] Add automated tests (not yet provided)

Complete this checklist to confirm the template is in a "ready to use" state. Good luck building your desktop app!
