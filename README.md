# NOTAM 解析系统

## 重构架构图（仅本次重构）

```text
重构后目录结构（仅本次重构）

├── apps
│   ├── backend                     # 后端 FastAPI 服务
│   │   ├── app
│   │   │   ├── api                  # API 路由注册与版本入口
│   │   │   │   └── routes           # 具体业务接口（auth/notam/dashboard/tasks……）
│   │   │   ├── core                 # 配置/日志/错误/安全/限流
│   │   │   ├── db                   # SQLModel 数据模型与会话
│   │   │   ├── schemas              # Pydantic 请求/响应模型
│   │   │   ├── services             # 业务服务层（解析/审计等）
│   │   │   └── scripts              # 种子数据/初始化脚本
│   │   ├── pyproject.toml           # 后端依赖（uv）
│   │   └── requirements.txt         # 运行依赖清单
│   └── frontend                     # 前端 Vue3 应用
│       ├── src
│       │   ├── assets               # 全局样式/静态资源
│       │   ├── services             # API 封装（auth/notam/...）
│       │   ├── stores               # Pinia 状态管理
│       │   ├── views                # 页面（登录/首页/占位模块）
│       │   └── router               # 路由配置
│       ├── package.json             # 前端依赖
│       └── vite.config.ts           # Vite 构建配置
├── notam                            # NOTAM 解析核心模块（由原研究代码迁移而来）
│   ├── main.py                      # CLI 解析入口
│   ├── streamlit_app.py             # Streamlit 演示入口
│   ├── config.yaml                  # NOTAM 解析配置
│   ├── config                       # Prompt 与解析配置
│   ├── src                          # NOTAM 解析核心代码
│   │   ├── api_manager.py           # 大模型 API 调用管理
│   │   ├── agents.py                # 多智能体解析逻辑
│   │   ├── debate.py                # 多轮辩论/一致性机制
│   │   ├── mining.py                # 数据挖掘与辅助处理
│   │   ├── models.py                # 数据结构定义
│   │   ├── post_processor.py        # 解析结果后处理
│   │   └── handler                  # JSON / 数据读写处理
│   └── data                         # NOTAM 输入、输出与样例数据
├── infra
│   └── docker-compose.yml           # 一键启动前后端 + DB + Redis
├── docs
│   └── demos                        # 演示脚本（登录/解析/看板）
└── .env.example                     # 环境变量模板
```

## 整体架构说明

当前仓库包含两层：

1) **NOTAM 研究解析流水线（保留并模块化迁移）**

   原有 NOTAM 解析代码已从根目录迁移到 `notam/` 目录下，作为独立解析模块保留。

   - CLI 解析流程：`notam/main.py`
   - Streamlit 演示：`notam/streamlit_app.py`
   - 核心代码：`notam/src/`
   - Prompt 与配置：`notam/config/`、`notam/config.yaml`
   - 输入输出数据：`notam/data/`

   该部分主要负责从原始 NOTAM 文本中抽取结构化字段，支持大模型 API 调用、自一致性机制、Prompt 配置、多智能体解析与结果后处理。

2) **产品 MVP 平台（新增）**

   面向后续系统化展示与应用落地，仓库新增了 ZhiJian-AeroNLP 平台的 MVP 骨架。

   - **后端**：FastAPI + SQLModel + JWT + RBAC + 审计日志
     - 入口：`apps/backend/app/main.py`
     - 核心：`apps/backend/app/core`（配置/日志/错误/安全）
     - 数据模型：`apps/backend/app/db/models.py`
     - API 路由：`apps/backend/app/api/routes/*`

   - **前端**：Vue3 + Vite + TypeScript + Pinia + Router + Naive UI
     - 入口：`apps/frontend/src/main.ts`
     - 页面：`apps/frontend/src/views/*`（登录 + 首页 + 占位模块）

   - **基础设施**：Docker Compose 本地一键运行
     - `infra/docker-compose.yml`

## MVP 重构（新应用结构）

仓库已新增 ZhiJian-AeroNLP 平台的 MVP 骨架：

- 后端：`apps/backend`（FastAPI + SQLModel + JWT + RBAC + 审计日志）
- 前端：`apps/frontend`（Vue3 + Vite + TypeScript + Pinia + Naive UI）
- NOTAM 解析模块：`notam`（原研究解析流水线模块化迁移）
- 部署：`infra/docker-compose.yml`
- 文档：`docs/ARCHITECTURE.md` 与 `docs/demos/*`

## 快速启动

### vscode task启动

`Ctrl + Shift + P` -> `Tasks: Run Task` -> 选择 `更新依赖后启动` 或 `启动`


- 后端：http://localhost:8000/docs
- 前端：http://localhost:5173

### 后端

```bash
cd apps/backend
uv venv
uv sync
uv run uvicorn app.main:app --reload --port 8000
```

### 前端

```bash
cd apps/frontend
npm install
npm run dev
```

### NOTAM 解析模块

原有 NOTAM 解析流程已迁移到 `notam/` 目录下，可继续独立运行。

```bash
# CLI 解析入口
python -m notam.main

# Streamlit 演示入口
streamlit run notam/streamlit_app.py
```

## 当前重构说明

本次重构主要完成以下调整：

1. 将原有 NOTAM 研究解析代码从根目录迁移到 `notam/`；
2. 保留 CLI 解析与 Streamlit 演示能力；
3. 将 NOTAM 解析逻辑与产品 MVP 应用结构分离；
4. 为后续后端服务调用 NOTAM 解析模块预留结构基础；
5. 保持前后端 MVP 骨架独立运行，便于后续接入真实解析能力。

## 后续计划

- 将 `notam/` 中的解析能力封装为统一服务接口；
- 在 `apps/backend` 中接入 NOTAM 解析模块；
- 完善解析任务、历史记录、审计日志与结果展示；
- 将前端占位页面逐步替换为真实业务页面；
- 补充 Docker Compose 下的完整联调流程。