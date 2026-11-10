# React Template 项目说明

一个基于 React 18 + Vite + TypeScript 的前端模板，预置 Ant Design 5、TailwindCSS、React Router v6、Zustand、Axios 等常用技术栈，并包含基础的权限守卫、主题与样式方案以及示例页面与 Mock 路由数据，适合用于快速启动后台管理或中后台应用。

## 特性
- 基于 Vite 的极速开发与构建
- TypeScript 全量类型支持
- Ant Design 5 + 自定义主题
- TailwindCSS 原子化样式（结合 PostCSS）
- React Router v6 路由与基础权限守卫
- Zustand 轻量状态管理
- Axios 网络请求封装与常用工具
- 目录清晰，可扩展性良好

## 快速开始

前置要求：
- Node.js >= 16（建议 18+）
- 推荐使用 pnpm（项目包含 pnpm-lock.yaml）

安装依赖：
- pnpm install

本地开发：
- pnpm dev

生产构建：
- pnpm build

本地预览构建产物：
- pnpm preview

以上脚本等同于 package.json 中定义的：
- dev: vite
- build: tsc && vite build
- preview: vite preview

## 目录结构与关键文件

仅列出与模板相关的关键目录和文件：
- index.html: 应用入口 HTML 模板
- src/main.tsx: React 入口，挂载根组件，启用 Suspense 等
- src/App.tsx: 顶层应用组件，组织路由与布局
- src/pages/*: 业务页面（如 MainLayout、Dashboard 等）
- src/components/*: 复用组件（含 auth/AuthGuard.tsx 等）
- src/providers/ThemeProvider.tsx: 主题与全局样式提供
- src/config/*: 配置相关（如 mockRoutes.ts、主题配置等）
- src/mock/routeData.ts: 示例/Mock 路由数据
- src/style/index.css: TailwindCSS 与全局样式入口
- vite.config.ts: Vite 配置（含别名等）
- tailwind.config.js: TailwindCSS 配置
- postcss.config.js: PostCSS 相关插件配置
- tsconfig*.json: TypeScript 配置

## 路由与权限
- React Router v6 负责路由管理
- 通过 components/auth/AuthGuard.tsx 实现基础的路由访问守卫，可按需接入登录态、角色等鉴权逻辑
- 示例路由数据见 src/config/mockRoutes.ts 与 src/mock/routeData.ts，可替换为后端下发或本地配置

## 样式与主题
- 使用 TailwindCSS + PostCSS 构建样式体系，快速开发常见 UI
- 集成 Ant Design 5，可在 src/config/theme 下调整主题变量
- 通过 providers/ThemeProvider.tsx 注入全局主题配置与 Reset 样式

## 状态管理与网络
- 使用 Zustand 进行轻量化的全局状态管理
- 使用 Axios 进行网络请求封装，可在 src 下按需添加拦截器、请求工具与类型定义

## 开发建议
- 组件尽量保持无副作用与可复用性，跨页面状态优先考虑 Zustand
- 路由与权限请集中在 App.tsx 与 AuthGuard 中管理，保持单一来源
- 样式优先使用 Tailwind 原子类，必要时在 style 目录中补充抽象样式/变量
- 严格使用 TypeScript 类型，尽量避免 any；保持模块边界清晰

## 常见问题
- 运行 dev 报错：请确认 Node 版本满足要求，并正确安装依赖（推荐 pnpm）
- Ant Design 变量未生效：检查 ThemeProvider 与 antd 主题配置是否被正确注入
- 路由白屏：检查 Suspense fallback 与路由配置是否完整，组件是否 Lazy 加载

## 许可证
本项目模板未指定许可证，请在实际使用时根据团队/项目需要添加 LICENSE 并在 README 中补充说明。
