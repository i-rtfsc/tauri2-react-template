# 文档中心

[English](./en/README.md) | 简体中文

欢迎来到 **Tauri 2 + React 桌面应用模板** 文档中心。

## 文档导航

| 文档 | 说明 |
|------|------|
| [快速开始](./getting_started.md) | 环境配置、安装运行、构建发布 |
| [架构设计](./architecture/architecture_overview.md) | DDD + CQRS 架构详解 |
| [开发指南](./zh/development.md) | 日常开发、添加功能、调试技巧 |
| [更新日志](./changelog.md) | 版本更新记录 |

## 推荐阅读顺序

1. **[快速开始](./getting_started.md)** - 搭建开发环境，运行项目
2. **[架构设计](./architecture/architecture_overview.md)** - 理解 DDD + CQRS 架构
3. **[开发指南](./zh/development.md)** - 学习如何扩展功能

## 架构概览

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

## 技术栈

### 前端
- React 18 + TypeScript
- Vite 构建
- shadcn/ui (40+ 组件)
- TanStack Query + Zustand
- i18next 多语言

### 后端
- Rust + Tauri 2
- SQLx + SQLite
- DDD + CQRS 架构
- Tracing 日志

## 快速命令

```bash
make install    # 安装依赖
make dev        # 开发模式
make build      # 构建发布
make clean      # 清理
```
