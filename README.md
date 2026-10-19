# DeepGuard 官网与功能体验

本项目使用 Vite 构建官网首页和 React 功能体验页，并由同一条 GitHub Actions 流程发布到 GitHub Pages。

## 页面

- `/`：DeepGuard 产品官网，内嵌 `/demo/` 功能体验。
- `/demo/`：独立访问的 React 功能体验页。
- `/?v=3`：旧体验链接兼容入口，会转到 `/demo/?v=3`。

## 本地运行

需要 Node.js。

```bash
npm ci
npm run dev
```

生产构建与预览：

```bash
npm run build
npm run preview
```

代码类型检查：

```bash
npm run lint
```

推送到 `main` 后，现有 GitHub Actions 会构建 `dist/` 并发布官网与体验页。

## 体验数据

当前体验页使用前端模拟数据。输入 Call ID 可查看分析动画和结果展示，但这些结果不代表真实风控判断。
