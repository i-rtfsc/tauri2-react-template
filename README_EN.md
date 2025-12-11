# Tauri 2 + React Desktop App Template

[简体中文](./README.md) | English

A modern desktop application template built with **Tauri 2 + Rust + React**, featuring **DDD + CQRS** architecture on the backend, 40+ shadcn/ui components and i18n support on the frontend.

## Features

- **Tauri 2** - Lightweight cross-platform desktop framework for macOS / Windows / Linux
- **DDD + CQRS** - Domain-Driven Design with Command Query Responsibility Segregation
- **React 18 + TypeScript** - Type-safe frontend development
- **shadcn/ui** - 40+ beautiful components built on Radix UI + Tailwind CSS
- **i18n Support** - Built-in Chinese/English switching (i18next)
- **SQLite** - Local data persistence with auto-migration
- **Window State** - Auto save/restore window size and position

## Quick Start

### Prerequisites

- Node.js >= 20
- Rust >= 1.70
- Platform dependencies:
  - macOS: Xcode Command Line Tools
  - Linux: `libwebkit2gtk-4.1-dev`, `libappindicator3-dev`
  - Windows: WebView2 Runtime

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/tauri2-react-template.git
cd tauri2-react-template

# Install dependencies
make install

# Start development mode
make dev

# Build for production
make build
```

## Project Structure

```
tauri2-react-template/
├── apps/desktop/
│   ├── src/                          # React Frontend
│   │   ├── components/
│   │   │   ├── layout/               # Layout components (Sidebar, TopBar, etc.)
│   │   │   ├── ui/                   # shadcn/ui component library
│   │   │   └── users/                # Business components
│   │   ├── hooks/                    # Custom Hooks
│   │   ├── pages/                    # Page components
│   │   ├── i18n/                     # Internationalization
│   │   └── lib/                      # Utilities
│   │
│   └── src-tauri/                    # Rust Backend (DDD + CQRS)
│       ├── src/
│       │   ├── domain/               # Domain Layer
│       │   │   ├── cqrs.rs           # CQRS core traits
│       │   │   ├── users.rs          # User entity, commands, queries
│       │   │   ├── config.rs         # Config entity, commands, queries
│       │   │   └── events.rs         # Domain events
│       │   ├── application/          # Application Layer (Handlers)
│       │   │   ├── user_commands.rs  # User command handler
│       │   │   ├── user_queries.rs   # User query handler
│       │   │   ├── config_commands.rs
│       │   │   └── config_queries.rs
│       │   ├── infra/                # Infrastructure Layer
│       │   │   ├── db.rs             # Database initialization
│       │   │   ├── repo_users.rs     # User repository implementation
│       │   │   ├── repo_config.rs    # Config repository implementation
│       │   │   └── event_publisher.rs
│       │   ├── interface/            # Interface Layer
│       │   │   ├── commands.rs       # Tauri commands
│       │   │   └── tray.rs           # System tray
│       │   └── main.rs               # Application entry
│       └── migrations/               # Database migrations
│
├── packages/                         # Shared packages (reserved)
├── docs/                             # Documentation
└── Makefile                          # Common commands
```

## Architecture

### DDD Four-Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Interface Layer                          │
│              (Tauri Commands, System Tray)                  │
├─────────────────────────────────────────────────────────────┤
│                   Application Layer                         │
│           (CommandHandlers, QueryHandlers)                  │
├─────────────────────────────────────────────────────────────┤
│                     Domain Layer                            │
│    (Entities, Commands, Queries, Repository Traits)         │
├─────────────────────────────────────────────────────────────┤
│                  Infrastructure Layer                       │
│      (SQLite Repositories, HTTP Client, Logging)            │
└─────────────────────────────────────────────────────────────┘
```

### CQRS Pattern

This template implements a complete CQRS pattern:

```rust
// Commands (write operations)
pub struct CreateUserCmd { ... }
impl Command for CreateUserCmd {}

// Queries (read operations)
pub struct ListUsersQuery;
impl Query for ListUsersQuery {}

// Command Handler
impl CommandHandler<CreateUserCmd, User> for UserCommandHandler { ... }

// Query Handler
impl QueryHandler<ListUsersQuery, Vec<User>> for UserQueryHandler { ... }
```

### Data Flow

```
┌──────────┐    invoke()    ┌───────────┐    handle()    ┌─────────────┐
│  React   │ ─────────────> │  Tauri    │ ─────────────> │  Command/   │
│  Frontend│                │  Command  │                │  Query      │
└──────────┘                └───────────┘                │  Handler    │
     ^                                                   └──────┬──────┘
     │                                                          │
     │                                                          v
     │         Event                                    ┌───────────────┐
     └─────────────────────────────────────────────────│  Repository   │
                                                        │  (SQLite)     │
                                                        └───────────────┘
```

## Frontend Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| TanStack Query | Server State Management |
| Zustand | Client State Management |
| React Router | Routing |
| shadcn/ui | UI Component Library |
| Tailwind CSS | Styling |
| i18next | Internationalization |
| React Hook Form + Zod | Form Validation |

## Backend Stack

| Technology | Purpose |
|------------|---------|
| Rust | Systems Programming Language |
| Tauri 2 | Desktop Application Framework |
| SQLx | Async Database Operations |
| SQLite | Local Database |
| Tokio | Async Runtime |
| Serde | Serialization |
| Tracing | Logging |

## Commands

```bash
make install    # Install dependencies
make dev        # Start development mode
make build      # Build for production
make clean      # Clean build artifacts
make status     # Check environment status
```

## Documentation

- [Getting Started](./docs/getting_started.md)
- [Architecture](./docs/architecture/architecture_overview.md)
- [Development Guide](./docs/en/development.md)
- [Changelog](./docs/changelog.md)

## License

[MIT License](./LICENSE)
