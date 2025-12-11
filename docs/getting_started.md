# 快速开始

本指南帮助你快速搭建开发环境并运行项目。

## 环境要求

| 工具 | 版本要求 | 说明 |
|------|----------|------|
| Node.js | >= 20 | 推荐使用 LTS 版本 |
| Rust | >= 1.70 | 通过 rustup 安装 |
| npm | >= 10 | Node.js 自带 |

### 平台依赖

**macOS:**
```bash
xcode-select --install
```

**Ubuntu/Debian:**
```bash
sudo apt update && sudo apt install -y \
  libwebkit2gtk-4.1-dev build-essential curl wget file \
  libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
```

**Windows:**
- 安装 [WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)
- 安装 Visual C++ Redistributable

## 安装步骤

### 1. 克隆项目

```bash
git clone https://github.com/你的用户名/tauri2-react-template.git
cd tauri2-react-template
```

### 2. 安装依赖

```bash
make install
```

或者手动安装：

```bash
npm install
cd apps/desktop && npm install --legacy-peer-deps
```

### 3. 启动开发模式

```bash
make dev
```

启动后会自动：
1. 启动 Vite 开发服务器 (React 前端)
2. 编译 Rust 后端
3. 打开 Tauri 桌面窗口

前端支持热重载，修改代码后自动刷新。

### 4. 构建发布版本

```bash
make build
```

构建产物位于：
- macOS: `apps/desktop/src-tauri/target/release/bundle/macos/`
- Windows: `apps/desktop/src-tauri/target/release/bundle/msi/`
- Linux: `apps/desktop/src-tauri/target/release/bundle/appimage/`

## 项目结构概览

```
apps/desktop/
├── src/                          # React 前端
│   ├── components/
│   │   ├── layout/               # 布局: Sidebar, TopBar, PageContainer
│   │   ├── ui/                   # shadcn/ui 组件 (40+)
│   │   └── users/                # 用户业务组件
│   ├── hooks/                    # Hooks: useUsers, useTheme, useEvent
│   ├── pages/                    # 页面: Home, Users, Settings
│   └── i18n/                     # 国际化: zh-CN, en-US
│
└── src-tauri/                    # Rust 后端
    ├── src/
    │   ├── domain/               # 领域层: 实体、命令、查询、事件
    │   ├── application/          # 应用层: CommandHandler, QueryHandler
    │   ├── infra/                # 基础设施: SQLite 仓储、日志
    │   └── interface/            # 接口层: Tauri 命令
    └── migrations/               # 数据库迁移脚本
```

## 示例页面

| 页面 | 说明 |
|------|------|
| Home | 仪表盘示例，展示卡片和图表 |
| Users | 用户 CRUD，演示完整数据流 |
| Settings | 设置页面，包含主题切换、日志查看 |
| Components | shadcn/ui 组件展示 |

## 数据流示例

以「创建用户」为例：

```
1. React: 表单提交 → useUsers().createUser(data)
                     ↓
2. Tauri: invoke('create_user', { cmd: data })
                     ↓
3. Rust Interface: commands::create_user(handler, cmd)
                     ↓
4. Application: UserCommandHandler.handle(CreateUserCmd)
                     ↓
5. Infrastructure: SqliteUserRepository.create(user)
                     ↓
6. React: TanStack Query 缓存失效 → 表格刷新
```

## 常用命令

```bash
make install    # 安装依赖
make dev        # 开发模式
make build      # 构建发布
make clean      # 清理构建
make status     # 检查环境
```

## 常见问题

| 问题 | 解决方案 |
|------|----------|
| npm 依赖安装失败 | 使用 `npm install --legacy-peer-deps` |
| Rust 编译失败 | 确保已安装 Rust 工具链，运行 `rustup update` |
| macOS 窗口无法打开 | 在系统偏好设置中授权应用 |
| SQLite 表不存在 | 删除 `target/` 目录下的数据库文件，重启应用 |
| Linux 日志目录打不开 | 安装 `xdg-utils` 包 |

## 下一步

- [架构设计](./architecture/architecture_overview.md) - 深入理解 DDD + CQRS
- [开发指南](./zh/development.md) - 学习如何扩展功能
