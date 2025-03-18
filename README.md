# 数据分析项目展示平台

一个现代化的Web应用，用于展示和管理数据分析项目。该平台支持多种项目类型，包括可视化项目和图文案例分析，为数据分析师提供一个分享工作成果和案例研究的专业平台。

## 功能特点

- **多种项目类型支持**：
  - 可视化项目：展示数据可视化仪表板、交互式图表等
  - 图文案例：详细记录分析过程、方法和结论的案例研究

- **强大的内容管理**：
  - 项目创建与编辑
  - 标签管理与分类
  - 图片上传与管理
  - 项目状态控制（上线/下线）

- **用户友好的界面**：
  - 响应式设计，适配各种设备
  - 实时预览功能
  - 简洁直观的项目展示

- **管理员功能**：
  - 项目管理与审核
  - 内容批量处理
  - 简单的数据库管理

## 技术栈

- **前端**：
  - Next.js 14（App Router）
  - React 18
  - TypeScript
  - Tailwind CSS
  - SWR（数据获取）

- **后端**：
  - Next.js API Routes
  - Node.js
  - PostgreSQL（数据库）

- **部署**：
  - Vercel（可选）
  - 支持自托管

## 开始使用

### 前提条件

- Node.js 18+
- PostgreSQL 数据库

### 安装步骤

1. 克隆仓库
   ```bash
   git clone https://github.com/Datazhang-hub/portfolio.git
   cd portfolio
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 配置环境变量
   创建一个`.env.local`文件，内容如下：
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/portfolio
   NEXTAUTH_SECRET=your-nextauth-secret
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-secure-password
   ```

4. 运行开发服务器
   ```bash
   npm run dev
   ```

5. 初始化数据库
   访问 `/api/init` 端点或在浏览器中打开 `/admin/fix-database` 页面

### 生产环境部署

构建优化版本：
```bash
npm run build
npm start
```

## 许可证

MIT

## 作者

DataZhang
