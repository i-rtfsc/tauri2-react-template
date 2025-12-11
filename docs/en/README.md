# Documentation Hub

English | [简体中文](../README.md)

Welcome to the **Tauri 2 + React Desktop App Template** documentation center.

## Documentation Navigation

| Document | Description |
|----------|-------------|
| [Quick Start](../getting_started.md) | Environment setup, installation, building |
| [Architecture](../architecture/architecture_overview.md) | DDD + CQRS architecture details |
| [Development Guide](./development.md) | Daily development, adding features, debugging |
| [Changelog](../changelog.md) | Version update history |

## Recommended Reading Order

1. **[Quick Start](../getting_started.md)** - Set up dev environment, run the project
2. **[Architecture](../architecture/architecture_overview.md)** - Understand DDD + CQRS architecture
3. **[Development Guide](./development.md)** - Learn how to extend features

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                 React Frontend (TypeScript)                 │
│         shadcn/ui · TanStack Query · i18next                │
├─────────────────────────────────────────────────────────────┤
│                    Tauri IPC Bridge                         │
├─────────────────────────────────────────────────────────────┤
│                  Rust Backend (DDD + CQRS)                  │
│  ┌──────────────┬───────────────┬───────────────────────┐   │
│  │  Interface   │  Application  │    Infrastructure     │   │
│  │  (Commands)  │  (Handlers)   │    (Repositories)     │   │
│  └──────────────┴───────────────┴───────────────────────┘   │
│                        Domain Layer                         │
│            (Entities · Commands · Queries · Events)         │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite build tool
- shadcn/ui (40+ components)
- TanStack Query + Zustand
- i18next multi-language

### Backend
- Rust + Tauri 2
- SQLx + SQLite
- DDD + CQRS architecture
- Tracing logging

## Quick Commands

```bash
make install    # Install dependencies
make dev        # Development mode
make build      # Production build
make clean      # Clean
```
