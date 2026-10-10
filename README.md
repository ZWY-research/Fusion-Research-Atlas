# Fusion Research Atlas

V0.1 交互式科研图谱原型，使用 React、TypeScript、Vite 与 Cytoscape.js。正式仓库名称为 `Fusion-Research-Atlas`。

- GitHub 仓库：[ZWY-research/Fusion-Research-Atlas](https://github.com/ZWY-research/Fusion-Research-Atlas)
- 网站入口：[Fusion Research Atlas](https://zwy-research.github.io/Fusion-Research-Atlas/)

## 本地运行

需要 Node.js 24 LTS 与 npm。

```powershell
npm ci
npm run dev -- --host 127.0.0.1
```

打开终端显示的 `/Fusion-Research-Atlas/` 地址。生产预览：

```powershell
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

入口为 http://127.0.0.1:4173/Fusion-Research-Atlas/ 。这是本地预览地址，不是运行时配置。GitHub Pages 路径为 `/Fusion-Research-Atlas/`。

## 功能与数据

图谱支持拖动、缩放、节点选择、关系高亮、名称及关键词搜索、类型和证据状态组合筛选。左侧节点列表可使用键盘浏览。节点采用 hash 深链接，可刷新与前进后退，无需服务器路径重写。

数据独立存于 `public/data/electron-density.json`，通过 Vite 的 BASE_URL 请求；`src/model.ts` 定义并在运行时验证版本化模型。包含科学问题、现象、知识、假设、证据、研究缺口和验证方法。关系同时记录方向、语义、状态、依据与来源。

**首个子图是明确标记的研究组织示例，不包含真实实验数据，也不提供已核验的文献证据。** 证据节点表示待获取的证据种类，假设不等于结论。不得将示例用作论文或实验报告中的已验证事实。增加真实来源时应逐项核查来源对结论的支持范围。

## 验证

```powershell
npm run validate:data
npm run typecheck
npm test
npm run build
npx playwright install chromium
$env:FRA_SCREENSHOT_DIR = '<本地审查截图目录>'
npm run test:browser
```

浏览器测试检查生产构建的真实画布交互、详情、搜索、筛选、hash 刷新、手机布局和加载失败。测试与截图结果保存在本地审查工作区，勿提交私有科研材料。

源码使用 MIT License；公开示例数据同样以 MIT 授权。以后引入的论文、图片和实验数据需单独确认公开权限与许可。

若本机已安装 Chrome，可省去 Chromium 下载，测试前设置：

```powershell
$env:FRA_BROWSER_CHANNEL = 'chrome'
```

未设置 FRA_SCREENSHOT_DIR 时，截图默认保存到 test-results/screenshots。

## 贡献

欢迎通过 GitHub Issues 报告问题，或提交 Pull Request 改善交互、文档与测试。提交前请运行数据校验、类型检查、单元测试、lint 和生产构建；涉及界面时请复验浏览器交互。

科学内容贡献必须说明来源、适用范围与证据状态，明确区分示例、假设与已核验材料，不得提交非公开实验数据、私人科研文件或认证凭据。新证据须先确认公开权限及许可，并逐条核验对主张的支持范围。

## 自动部署

`.github/workflows/deploy.yml` 在 push main 或手动触发时使用 Node.js 24 安装依赖、验证数据与类型、运行测试和 lint、构建 dist，并通过 GitHub 官方 Pages Actions 部署。站点采用 hash 深链接。
