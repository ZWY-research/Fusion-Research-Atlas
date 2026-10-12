# Contributing to Fusion Research Atlas | FRA 贡献指南

**EN** Welcome. FRA is a cross-disciplinary scientific collaboration. You can participate without writing code or specializing in fusion physics. Contributions in English or Chinese are welcome.\
**中文** 欢迎参与 FRA 跨学科科学研究协作。无需编写程序，也无需具备完整的聚变物理背景。可以使用中文或英文参与。

## 1. Choose a contribution | 选择参与方式

Use the [GitHub Issue form selector / GitHub Issue 表单入口](https://github.com/ZWY-research/Fusion-Research-Atlas/issues/new/choose) to begin a scientific discussion. GitHub sign-in is required to submit an Issue / 提交 Issue 需要登录 GitHub。

| Form                  | 表单     | Use it for / 适用情形                                                                                                                 |
| --------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Research Question     | 科学问题 | An observation, discrepancy, or unresolved mechanism / 观察现象、研究差异或未解决的机制                                               |
| Evidence Contribution | 证据贡献 | A paper, public experiment, simulation, or theoretical result / 论文、公开实验、模拟或理论结果                                        |
| Scientific Challenge  | 科学质疑 | A counterexample, alternative explanation, incorrect assumption, or incompatible result / 反例、其他解释、不成立的假设或不一致结果    |
| Verification Proposal | 验证提案 | An experiment, mathematical derivation, reproducible calculation, or discriminating test / 实验、数学推导、可复现计算或区分机制的检验 |

**EN** You may also submit a Pull Request for bilingual scientific content, corrections, code, tests, visualization, accessibility, or documentation.\
**中文** 也可通过 Pull Request 贡献双语科学内容、勘误、代码、测试、图谱可视化、可访问性或文档改进。

### Scientific literature contributions | 科学文献评议贡献

**EN** Begin with the [literature catalogue](docs/literature/README.md) and use the [bilingual review template](docs/literature/REVIEW_TEMPLATE.md) for a new paper page. The existing four Issue forms and Pull Request process cover all literature contributions:

**中文** 请先查阅[文献目录](docs/literature/README.md)，新增论文页面时沿用[双语评议模板](docs/literature/REVIEW_TEMPLATE.md)。文献贡献复用现有四种 Issue 表单和 Pull Request 流程：

| Contribution / 贡献内容                                                                            | Existing route / 现有入口                                                                                                            |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Recommend an original paper worth studying / 推荐值得研究的原始论文                                | Evidence Contribution / 证据贡献                                                                                                     |
| Add a specific finding with its conditions and source locator / 贡献具体科学证据及其条件与原文位置 | Evidence Contribution / 证据贡献                                                                                                     |
| Correct an error or omission in a review / 指出评议中的错误或遗漏                                  | Scientific Challenge, or a focused correction PR / 科学质疑，或勘误 PR                                                               |
| Propose a competing physical explanation / 提出竞争性物理解释                                      | Scientific Challenge / 科学质疑                                                                                                      |
| Add a mathematical, simulation, or experimental verification method / 补充数学、模拟或实验验证方法 | Verification Proposal / 验证提案                                                                                                     |
| Submit a new English–Chinese scientific review / 提交新的中英双语科学文献评议                      | Pull Request; Research Question for unresolved questions raised by the review / Pull Request；评议引出的未解决问题可使用科学问题表单 |

**EN** For a review PR, create one file in `docs/literature/papers/`, link it from the relevant domain sections, and update the distinct-paper counts in the catalogue and README when warranted. Check for an existing DOI record to avoid duplicate pages; retain graph source and finding IDs when present, link the related question, and separate reported results, authors' interpretations, and FRA analysis. Record actual reading scope, claim assessment, review date/version, and any independent verification with its evidence. Mark unfinished sections as pending. Keep indexed, reviewed, and independently verified counts separate, and add verified claims to graph data only in a subsequent, explicitly supported change.

**中文** 提交评议 PR 时，在 `docs/literature/papers/` 新建一个文件，从相关领域栏目链接该文件，并在实际状态变化时同步更新目录与 README 的去重统计。先查找已有 DOI 记录，避免重复页面；如已有图谱来源与发现 ID，应保留这些标识并关联科学问题，区分原文报告结果、作者解释和 FRA 分析。记录实际阅读范围、主张核验程度、评议日期与版本，以及独立验证的证据。未完成栏目明确标为待研究，收录、完成评议和独立验证分别计数。后续只有具备明确科学依据时，才另行将经核验的主张加入图谱数据。

**EN** For changes confined to Markdown, check the changed files with the existing Prettier installation, run `git diff --check`, and verify relative links, section anchors, source links, bilingual correspondence, counts, and status descriptions. Browser regression is needed when browser behaviour changes.

**中文** 仅修改 Markdown 时，使用现有 Prettier 检查修改文件，执行 `git diff --check`，并核对相对链接、章节锚点、来源链接、双语对应、统计和状态描述。修改浏览器行为时再执行浏览器回归测试。

## 2. A useful scientific submission | 一份有价值的科学贡献

You do not need complete scientific answers to start a discussion. Required form fields must be filled; explicitly mark unknown information as unknown / 发起讨论无需已有完整科学答案，但须填写表单必填字段；尚不清楚的信息可明确标注为未知。

1. **Research question / 科学问题：** State the question or unexplained phenomenon clearly / 清楚表述问题或尚未解释的现象。
2. **Scope / 研究条件：** Identify the device/system, physical region, operating regime, relevant parameters and assumptions when known / 尽可能说明装置或物理系统、位置、运行条件、关键参数与假设。
3. **Evidence / 证据：** Provide a DOI and specific figure/table/page/equation when possible, or a legitimate alternative public source / 尽可能提供 DOI 及对应图表、页码或方程；也可以提供其他合法公开来源。
4. **Interpretation / 解释：** Separate what the source actually reports from the proposed mechanism / 区分来源实际报告的结果和所提出的机制解释。
5. **Uncertainty / 局限：** Identify what remains uncertain, contradictory, model-dependent, or untested / 说明未知、矛盾、模型依赖或未经验证的内容。
6. **Verification / 验证：** Suggest a test or a result that would discriminate competing explanations, if possible / 如有思路，请提出能够区分竞争解释的检验方案。

**EN** Precise uncertainty is useful. A scientific challenge does not have to disprove an existing result; identifying where a claim no longer applies can also advance understanding.\
**中文** 准确指出不确定性本身就有价值。科学质疑不一定要推翻已有结论；明确某个结论在哪些条件下不再适用，同样能够推动认识。

## 3. Evidence integrity | 科学证据规范

- **EN:** Bibliographic/DOI validation is not validation of a physical claim. Clearly distinguish metadata, abstract, full-text, claim-level, and independent checks.\
  **中文：** DOI 与书目信息核验不等于物理主张得到证明。明确区分书目信息、摘要、全文、具体主张和独立验证。
- **EN:** Preserve physical conditions, definitions, uncertainty, theoretical assumptions, and contrary evidence where available.\
  **中文：** 尽可能保留物理条件、变量定义、不确定性、理论假设和反面证据。
- **EN:** Competing hypotheses can coexist; their status should follow evidence, not preference or authority.\
  **中文：** 竞争性假设可以同时保留，其科学状态应由证据决定，而非个人偏好或权威地位。
- **EN:** Never present demonstration nodes, a linked paper, or AI-generated speculation as independently verified conclusions.\
  **中文：** 不得将演示节点、已链接文献或 AI 生成的推测表述为独立验证的结论。

See [the data model / 数据模型说明](docs/data-model.md) for object types, status fields, and source/claim relationships.

## 4. Editing the graph or code | 修改图谱或代码

**EN** Create a branch, make focused changes, then open a Pull Request that states what changed and why. For scientific records, explain the source of each substantive claim. Preserve stable node/edge/source identifiers, use existing schema conventions, and provide `zh` and `en` fields for public-facing graph content. If you can only draft in one language, an Issue is a good starting point for collaborative translation.\
**中文** 请使用独立分支进行修改，并提交说明变更内容与原因的 Pull Request。新增科学内容应说明实质性主张的来源。保留已有节点、关系与来源 ID，遵守现有数据结构，面向网站的正式图谱内容需具有 `zh` 与 `en` 字段。若只能先提供一种语言，可以先在 Issue 中讨论并寻求协作翻译。

Required local development environment / 本地开发环境：Node.js 24 + npm。

```bash
npm ci
npm run validate:data
npm run typecheck
npm test
npm run lint
npm run build
```

**EN** For UI/interaction changes, also run `npm run test:browser` using Chrome/Chromium as configured in the repository. A research-only Issue does not require local software installation or tests.\
**中文** 涉及界面交互的改动，还需按仓库配置使用 Chrome/Chromium 执行 `npm run test:browser`。仅提交科研 Issue 不需要安装开发环境或执行软件测试。

## 5. Sharing and attribution | 共享与署名

**EN** Submit only work and materials you are permitted to share. Do not publish confidential experiments, restricted research data, private correspondence, credentials, or third-party copyrighted papers/figures without the relevant rights. Source code and original illustrative content in this repository are covered by the [MIT License](LICENSE); external research materials may have separate licenses. GitHub contributions are visible through their associated Issues and Pull Requests; publication authorship or other scholarly credit must be discussed separately according to substantive contributions and applicable research norms.\
**中文** 只提交具有合法公开与共享权限的内容。不得公开保密实验、受限科研数据、私人通信、认证凭据，或未经授权的第三方论文全文及图片。仓库原创代码与原创示例内容遵循 [MIT 许可证](LICENSE)，外部科研资料可能采用其他许可证。GitHub 贡献可通过对应 Issue 和 Pull Request 追溯；论文署名等学术贡献认定应根据实际研究工作和适用规范另行讨论。

## 6. What happens next? | 提交之后

**EN** A contribution can become a clarified question, a traceable evidence record, a competing hypothesis, a proposed verification task, or a reviewed graph/code change. Not every submission will become a settled conclusion: unresolved or contradictory results are part of the atlas.\
**中文** 贡献内容可以转化为定义更清楚的科学问题、可追溯的证据记录、竞争性假设、研究验证任务，或经过审查的图谱与代码变更。并非每次贡献都必须得到确定结论：未解决或相互矛盾的研究结果本身也是图谱的一部分。

[**Start with an Issue · 通过 Issue 参与**](https://github.com/ZWY-research/Fusion-Research-Atlas/issues/new/choose) · [**Back to README · 返回项目首页**](README.md)
