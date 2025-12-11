# 架构设计

本文档详细介绍模板的 DDD + CQRS 架构设计。

## 整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        React Frontend                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Pages     │  │   Hooks     │  │     Components          │  │
│  │  HomePage   │  │  useUsers   │  │  shadcn/ui (40+)        │  │
│  │  UsersPage  │  │  useEvent   │  │  Layout components      │  │
│  │  Settings   │  │  useTheme   │  │  Business components    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│                            │                                     │
│                     invoke() / listen()                          │
├─────────────────────────────────────────────────────────────────┤
│                        Tauri IPC                                 │
├─────────────────────────────────────────────────────────────────┤
│                        Rust Backend                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Interface Layer                         │  │
│  │  commands.rs: create_user, list_users, set_app_setting... │  │
│  │  tray.rs: System tray menu                                 │  │
│  └───────────────────────────────────────────────────────────┘  │
│                            │                                     │
│                     CommandHandler / QueryHandler                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Application Layer                        │  │
│  │  UserCommandHandler: handle(CreateUserCmd) -> User         │  │
│  │  UserQueryHandler: handle(ListUsersQuery) -> Vec<User>     │  │
│  │  ConfigCommandHandler: handle(SetConfigCmd)                │  │
│  │  ConfigQueryHandler: handle(GetConfigQuery) -> Option      │  │
│  └───────────────────────────────────────────────────────────┘  │
│                            │                                     │
│                     Repository Traits                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                     Domain Layer                           │  │
│  │  cqrs.rs: Command, Query, CommandHandler, QueryHandler     │  │
│  │  users.rs: User, CreateUserCmd, DeleteUserCmd, Queries     │  │
│  │  config.rs: SetConfigCmd, GetConfigQuery                   │  │
│  │  events.rs: DomainEvent, IEventPublisher                   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                            │                                     │
│                     implements traits                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                 Infrastructure Layer                       │  │
│  │  repo_users.rs: SqliteUserRepository                       │  │
│  │  repo_config.rs: SqliteConfigRepository                    │  │
│  │  event_publisher.rs: TauriEventPublisher                   │  │
│  │  db.rs: Database init & migrations                         │  │
│  │  logging.rs: Tracing setup                                 │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## DDD 四层架构

### 1. Domain Layer (领域层)

领域层是架构的核心，包含业务逻辑的核心概念，不依赖任何外部框架。

**文件位置:** `src-tauri/src/domain/`

#### CQRS 核心 Traits (`cqrs.rs`)

```rust
/// 命令标记 trait - 表示写操作
pub trait Command: Send + Sync {}

/// 查询标记 trait - 表示读操作
pub trait Query: Send + Sync {}

/// 命令处理器 - 处理写操作
#[async_trait]
pub trait CommandHandler<C: Command, R = ()>: Send + Sync {
    async fn handle(&self, cmd: C) -> Result<R, AppError>;
}

/// 查询处理器 - 处理读操作
#[async_trait]
pub trait QueryHandler<Q: Query, R>: Send + Sync {
    async fn handle(&self, query: Q) -> Result<R, AppError>;
}
```

#### 用户领域 (`users.rs`)

```rust
// 实体
pub struct User {
    pub id: String,
    pub username: String,
    pub email: Option<String>,
    pub role: String,
    pub created_at: String,
    pub updated_at: String,
}

// 命令
pub struct CreateUserCmd { pub username: String, pub email: Option<String>, pub role: String }
pub struct DeleteUserCmd { pub id: String }
impl Command for CreateUserCmd {}
impl Command for DeleteUserCmd {}

// 查询
pub struct ListUsersQuery;
pub struct GetUserByIdQuery { pub id: String }
impl Query for ListUsersQuery {}
impl Query for GetUserByIdQuery {}

// 仓储接口
#[async_trait]
pub trait IUserRepository: Send + Sync {
    async fn create(&self, user: User) -> Result<User, AppError>;
    async fn list(&self) -> Result<Vec<User>, AppError>;
    async fn find_by_id(&self, id: &str) -> Result<Option<User>, AppError>;
    async fn delete(&self, id: &str) -> Result<(), AppError>;
}
```

#### 领域事件 (`events.rs`)

```rust
#[derive(Debug, Serialize, Clone)]
pub enum DomainEvent {
    ConfigChanged { key: String, value: String },
}

#[async_trait]
pub trait IEventPublisher: Send + Sync {
    fn publish(&self, event: DomainEvent);
}
```

### 2. Application Layer (应用层)

应用层实现 CQRS 的 CommandHandler 和 QueryHandler，编排业务流程。

**文件位置:** `src-tauri/src/application/`

#### 用户命令处理器 (`user_commands.rs`)

```rust
pub struct UserCommandHandler {
    repo: Arc<dyn IUserRepository>,
}

#[async_trait]
impl CommandHandler<CreateUserCmd, User> for UserCommandHandler {
    async fn handle(&self, cmd: CreateUserCmd) -> Result<User, AppError> {
        let user = User {
            id: Uuid::new_v4().to_string(),
            username: cmd.username,
            email: cmd.email,
            role: cmd.role,
            // ...
        };
        self.repo.create(user).await
    }
}

#[async_trait]
impl CommandHandler<DeleteUserCmd, ()> for UserCommandHandler {
    async fn handle(&self, cmd: DeleteUserCmd) -> Result<(), AppError> {
        self.repo.delete(&cmd.id).await
    }
}
```

#### 用户查询处理器 (`user_queries.rs`)

```rust
pub struct UserQueryHandler {
    repo: Arc<dyn IUserRepository>,
}

#[async_trait]
impl QueryHandler<ListUsersQuery, Vec<User>> for UserQueryHandler {
    async fn handle(&self, _query: ListUsersQuery) -> Result<Vec<User>, AppError> {
        self.repo.list().await
    }
}
```

### 3. Infrastructure Layer (基础设施层)

基础设施层实现领域层定义的接口，处理外部依赖。

**文件位置:** `src-tauri/src/infra/`

#### SQLite 仓储实现 (`repo_users.rs`)

```rust
pub struct SqliteUserRepository {
    pool: SqlitePool,
}

#[async_trait]
impl IUserRepository for SqliteUserRepository {
    async fn create(&self, user: User) -> Result<User, AppError> {
        sqlx::query("INSERT INTO users ...")
            .bind(&user.id)
            .execute(&self.pool)
            .await?;
        // ...
    }

    async fn list(&self) -> Result<Vec<User>, AppError> {
        sqlx::query_as::<_, User>("SELECT * FROM users ORDER BY created_at DESC")
            .fetch_all(&self.pool)
            .await
            .map_err(Into::into)
    }
}
```

#### 事件发布器 (`event_publisher.rs`)

```rust
pub struct TauriEventPublisher<R: Runtime> {
    app_handle: AppHandle<R>,
}

impl<R: Runtime> IEventPublisher for TauriEventPublisher<R> {
    fn publish(&self, event: DomainEvent) {
        let event_name = event.name();
        self.app_handle.emit(event_name, &event).ok();
    }
}
```

### 4. Interface Layer (接口层)

接口层暴露 Tauri 命令给前端，委托给应用层处理。

**文件位置:** `src-tauri/src/interface/`

```rust
#[tauri::command]
pub async fn create_user(
    handler: State<'_, UserCommandHandler>,
    cmd: CreateUserCmd,
) -> Result<User, AppError> {
    handler.handle(cmd).await
}

#[tauri::command]
pub async fn list_users(
    handler: State<'_, UserQueryHandler>,
) -> Result<Vec<User>, AppError> {
    handler.handle(ListUsersQuery).await
}
```

## 依赖注入

在 `main.rs` 中完成依赖注入：

```rust
// 创建仓储
let user_repo = Arc::new(SqliteUserRepository::new(pool.clone()));

// 创建 Handlers 并注入仓储
let user_cmd_handler = UserCommandHandler::new(user_repo.clone());
let user_query_handler = UserQueryHandler::new(user_repo);

// 注册到 Tauri State
app_handle.manage(user_cmd_handler);
app_handle.manage(user_query_handler);
```

## 数据流示例

### 创建用户流程

```
1. React: useUsers().createUser(data)
         ↓
2. Tauri IPC: invoke('create_user', { cmd: data })
         ↓
3. Interface: commands::create_user(handler, cmd)
         ↓
4. Application: UserCommandHandler.handle(CreateUserCmd)
         ↓
5. Domain: User entity created
         ↓
6. Infrastructure: SqliteUserRepository.create(user)
         ↓
7. Response: User returned to React
```

### 领域事件流程

```
1. ConfigCommandHandler.handle(SetConfigCmd)
         ↓
2. Save to database
         ↓
3. publisher.publish(DomainEvent::ConfigChanged)
         ↓
4. TauriEventPublisher.emit("config:changed", payload)
         ↓
5. React: useEvent("config:changed", handler)
```

## 添加新功能指南

### 1. 添加新实体

```rust
// domain/orders.rs
pub struct Order { ... }
pub struct CreateOrderCmd { ... }
pub struct ListOrdersQuery;

impl Command for CreateOrderCmd {}
impl Query for ListOrdersQuery {}

#[async_trait]
pub trait IOrderRepository: Send + Sync {
    async fn create(&self, order: Order) -> Result<Order, AppError>;
    async fn list(&self) -> Result<Vec<Order>, AppError>;
}
```

### 2. 添加 Handlers

```rust
// application/order_commands.rs
pub struct OrderCommandHandler { repo: Arc<dyn IOrderRepository> }

impl CommandHandler<CreateOrderCmd, Order> for OrderCommandHandler { ... }

// application/order_queries.rs
pub struct OrderQueryHandler { repo: Arc<dyn IOrderRepository> }

impl QueryHandler<ListOrdersQuery, Vec<Order>> for OrderQueryHandler { ... }
```

### 3. 实现仓储

```rust
// infra/repo_orders.rs
pub struct SqliteOrderRepository { pool: SqlitePool }

impl IOrderRepository for SqliteOrderRepository { ... }
```

### 4. 暴露命令

```rust
// interface/commands.rs
#[tauri::command]
pub async fn create_order(
    handler: State<'_, OrderCommandHandler>,
    cmd: CreateOrderCmd,
) -> Result<Order, AppError> {
    handler.handle(cmd).await
}
```

### 5. 注册到 Tauri

```rust
// main.rs
let order_repo = Arc::new(SqliteOrderRepository::new(pool.clone()));
let order_cmd_handler = OrderCommandHandler::new(order_repo.clone());
app_handle.manage(order_cmd_handler);

// invoke_handler 中添加
interface::commands::create_order,
```

## 架构优势

1. **关注点分离** - 每层职责清晰，易于维护
2. **可测试性** - 通过 trait 抽象，可轻松 mock 依赖
3. **可扩展性** - 添加新功能只需按模式扩展
4. **类型安全** - Rust + TypeScript 双重类型保障
5. **CQRS 分离** - 读写分离，便于优化和扩展
