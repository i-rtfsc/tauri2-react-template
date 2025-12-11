# Tauri 2 + React 桌面应用模板

简体中文 | [English](./README_EN.md)

一个基于 **Tauri 2 + Rust + React** 的现代桌面应用模板，后端采用 **DDD + CQRS** 架构，前端预置 40+ shadcn/ui 组件与多语言支持。

## 特性

- **Tauri 2** - 轻量级跨平台桌面框架，支持 macOS / Windows / Linux
- **DDD + CQRS** - 领域驱动设计 + 命令查询职责分离，代码分层清晰
- **React 18 + TypeScript** - 类型安全的前端开发体验
- **shadcn/ui** - 40+ 精美组件，基于 Radix UI + Tailwind CSS
- **多语言支持** - 内置中英文切换 (i18next)
- **SQLite** - 本地数据持久化，自动迁移
- **窗口状态记忆** - 自动保存/恢复窗口大小和位置

## 快速开始

### 环境要求

- Node.js >= 20
- Rust >= 1.70
- 平台依赖：
  - macOS: Xcode Command Line Tools
  - Linux: `libwebkit2gtk-4.1-dev`, `libappindicator3-dev`
  - Windows: WebView2 Runtime

### 安装与运行

```bash
# 克隆项目
git clone https://github.com/你的用户名/tauri2-react-template.git
cd tauri2-react-template

# 安装依赖
make install

# 启动开发模式
make dev

# 构建生产版本
make build
```

## 项目结构

```
tauri2-react-template/
├── apps/desktop/
│   ├── src/                          # React 前端
│   │   ├── components/
│   │   │   ├── layout/               # 布局组件 (Sidebar, TopBar, etc.)
│   │   │   ├── ui/                   # shadcn/ui 组件库
│   │   │   └── users/                # 业务组件
│   │   ├── hooks/                    # 自定义 Hooks
│   │   ├── pages/                    # 页面组件
│   │   ├── i18n/                     # 国际化配置
│   │   └── lib/                      # 工具函数
│   │
│   └── src-tauri/                    # Rust 后端 (DDD + CQRS)
│       ├── src/
│       │   ├── domain/               # 领域层
│       │   │   ├── cqrs.rs           # CQRS 核心 traits
│       │   │   ├── users.rs          # 用户实体、命令、查询
│       │   │   ├── config.rs         # 配置实体、命令、查询
│       │   │   └── events.rs         # 领域事件
│       │   ├── application/          # 应用层 (Handlers)
│       │   │   ├── user_commands.rs  # 用户命令处理器
│       │   │   ├── user_queries.rs   # 用户查询处理器
│       │   │   ├── config_commands.rs
│       │   │   └── config_queries.rs
│       │   ├── infra/                # 基础设施层
│       │   │   ├── db.rs             # 数据库初始化
│       │   │   ├── repo_users.rs     # 用户仓储实现
│       │   │   ├── repo_config.rs    # 配置仓储实现
│       │   │   └── event_publisher.rs
│       │   ├── interface/            # 接口层
│       │   │   ├── commands.rs       # Tauri 命令
│       │   │   └── tray.rs           # 系统托盘
│       │   └── main.rs               # 应用入口
│       └── migrations/               # 数据库迁移
│
├── packages/                         # 共享包 (预留)
├── docs/                             # 项目文档
└── Makefile                          # 常用命令
```

## 架构设计

### DDD 四层架构

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

### CQRS 模式

本模板实现了完整的 CQRS 模式：

```rust
// 命令 (写操作)
pub struct CreateUserCmd { ... }
impl Command for CreateUserCmd {}

// 查询 (读操作)
pub struct ListUsersQuery;
impl Query for ListUsersQuery {}

// 命令处理器
impl CommandHandler<CreateUserCmd, User> for UserCommandHandler { ... }

// 查询处理器
impl QueryHandler<ListUsersQuery, Vec<User>> for UserQueryHandler { ... }
```

### 数据流

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

## 前端技术栈

| 技术 | 用途 |
|------|------|
| React 18 | UI 框架 |
| TypeScript | 类型安全 |
| Vite | 构建工具 |
| TanStack Query | 服务端状态管理 |
| Zustand | 客户端状态管理 |
| React Router | 路由 |
| shadcn/ui | UI 组件库 |
| Tailwind CSS | 样式 |
| i18next | 国际化 |
| React Hook Form + Zod | 表单验证 |

## 后端技术栈

| 技术 | 用途 |
|------|------|
| Rust | 系统编程语言 |
| Tauri 2 | 桌面应用框架 |
| SQLx | 异步数据库操作 |
| SQLite | 本地数据库 |
| Tokio | 异步运行时 |
| Serde | 序列化 |
| Tracing | 日志系统 |

## 常用命令

```bash
make install    # 安装依赖
make dev        # 启动开发模式
make build      # 构建生产版本
make clean      # 清理构建产物
make status     # 检查环境状态
```

## 文档

- [快速开始](./docs/getting_started.md)
- [架构设计](./docs/architecture/architecture_overview.md)
- [开发指南](./docs/zh/development.md)
- [更新日志](./docs/changelog.md)

## 许可证

[MIT License](./LICENSE)
