### 来源
> fork from grafana/xk6-dashboard:master

### 目标
这个 k6 的 dashboard 组件，默认输出为英文的报告（如 `report.html`）。

将其调整为中文本地化的报告，默认输出为中文，并在界面提供语言切换按钮，可在中/英之间切换。

### 范围（Scope）
- 前端报告应用：`dashboard/assets/packages/report`（HTML 报告）与 `dashboard/assets/packages/ui`（交互式 UI）
- 生成与服务端入口：`report.go`、`web.go`、`cmd/k6-web-dashboard` 相关命令行入口与选项
- 文档与用法说明：`README.md`、`docs/how-it-works.md`

不在本轮范围：性能指标采集与统计逻辑（非文案层面）。

### 设计与技术方案
- i18n 基础
  - 在前端引入轻量 i18n 能力（建议自研简单字典 + `LanguageContext`，避免引入过重依赖）。
  - 目录结构：在 `packages/report` 与 `packages/ui` 内各自新增 `src/i18n/locales/{en,zh}.json`，并提供 `src/i18n/index.ts` 导出 `t()` 与 `LanguageProvider`。
  - 约定 key 命名：`<domain>.<component>.<message>`，如 `summary.card.duration`。
  - 首次落地以中文为默认（`zh`），英文为回退（`en`）。
- 语言切换
  - 在 `Header` 组件中加入语言切换按钮（`ZH/EN`），切换后：
    - 更新 `LanguageContext` 中的 `currentLang`
    - 持久化到 `localStorage`，键名如：`xk6-lang`
  - 页面初始化时按以下优先级确定语言：
    1. URL 查询参数 `?lang=zh|en`
    2. `localStorage` 持久化值
    3. CLI/内嵌初始语言（见下）
    4. 浏览器 `navigator.language`
- Go 侧集成
  - 新增 CLI 选项：`--lang`（或 `-L`），默认 `zh`，允许 `en`。
  - 在生成 `report.html` 或启动本地 Web 服务时，将初始语言通过：
    - 注入到页面的 `window.__DASHBOARD_LANG__`，或
    - URL 附带 `?lang=...`
  - 相关文件：`cmd/k6-web-dashboard/main.go`、`report.go`、`web.go`、`options.go`
- 字符串抽取
  - 从 `packages/report/src` 与 `packages/ui/src` 中逐步替换硬编码英文为 `t('...')`。
  - 先覆盖主视图与核心组件：`Header`、`Summary`、`Chart`、`Table`、`Tabs`、`Section` 等。
- 术语与度量单位对照（初版）
  - duration: 持续时间
  - iterations: 迭代次数
  - vus: 虚拟用户数
  - rps: 每秒请求数
  - percentile (p95/p99): 分位数
  - min/avg/max: 最小/平均/最大
  - pass/fail: 通过/失败

### 验收标准
- 默认生成/打开的报告为中文界面，关键页面（概览、摘要、时序/图表、表格）全部中文化。
- 顶部可显式切换为英文；切换后刷新页面仍能保留选择。
- 通过 CLI `--lang=en` 可让初始界面为英文。
- 若使用 URL `?lang=zh|en`，应能覆盖 CLI/本地存储并生效。
- 未翻译的残留文案不影响功能且可被检索定位。

### 里程碑与任务分解
- M1：落地 i18n 基础设施（`LanguageContext`、本地存储、URL 解析、`t()` 工具），`Header` 增加切换按钮（report/ui 各一）。
- M2：抽取 `packages/report` 主页面与核心组件文案；完成 `zh/en` 双语。
- M3：抽取 `packages/ui` 主页面与常用组件文案；完成 `zh/en` 双语。
- M4：Go 端 `--lang` 选项与页面初始语言注入打通；README 与使用说明更新。
- M5：自测与回归：
  - 静态 `report.html` 打开验证
  - 本地服务 `k6 web dashboard` 访问验证
  - 切换、刷新、深链接（带 `?lang=`）验证

### 回滚与兼容
- 回滚策略：保留英文回退包，关闭默认中文（`--lang=en`）即可恢复英文默认体验。
- 向后兼容：若缺少语言包键，`t()` 自动回退到英文或 key 本身。

### 风险与对策
- 硬编码英文分散：优先覆盖用户可见度最高的区域；逐步补齐低频路径。
- 体积增加：语言包 JSON 体积可控，必要时按需加载。
- 依赖风险：优先自研轻量实现，避免大依赖引入。

### 实施清单（首批改动位）
- report：
  - `packages/report/src/App/App.tsx`
  - `packages/report/src/components/Header/Header.tsx`
  - `packages/report/src/components/Summary/*`
  - `packages/report/src/components/Chart/*`
  - `packages/report/src/components/Table/*`
- ui：
  - `packages/ui/src/App/App.tsx`
  - `packages/ui/src/components/Header/Header.tsx`
- Go：
  - `cmd/k6-web-dashboard/main.go`
  - `report.go` / `web.go` / `options.go`