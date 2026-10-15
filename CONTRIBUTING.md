# Contributing to Fusion Research Atlas | FRA 贡献指南

**EN** Welcome. FRA is a cross-disciplinary scientific collaboration. You can participate without writing code or specializing in fusion physics. Contributions in English or Chinese are welcome.\
**中文** 欢迎参与 FRA 跨学科科学研究协作。无需编写程序，也无需具备完整的聚变物理背景。可以使用中文或英文参与。

## 1. Choose a contribution | 选择参与方式

Use the [GitHub Issue form selector / GitHub Issue 表单入口](https://github.com/ZWY-research/Fusion-Research-Atlas/issues/new/choose) to begin a scientific discussion. GitHub sign-in is required to submit an Issue / 提交 Issue 需要登录 GitHub。

| Form                           | 表单             | Use it for / 适用情形                                                                                                                 |
| ------------------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Research Question              | 科学问题         | An observation, discrepancy, or unresolved mechanism / 观察现象、研究差异或未解决的机制                                               |
| Evidence Contribution          | 证据贡献         | A paper, public experiment, simulation, or theoretical result / 论文、公开实验、模拟或理论结果                                        |
| Scientific Challenge           | 科学质疑         | A counterexample, alternative explanation, incorrect assumption, or incompatible result / 反例、其他解释、不成立的假设或不一致结果    |
| Verification Proposal          | 验证提案         | An experiment, mathematical derivation, reproducible calculation, or discriminating test / 实验、数学推导、可复现计算或区分机制的检验 |
| Literature Research Submission | 文献研究成果提交 | Evidence-grounded research-handoff.md, studied manually or with AI / 人工或 AI 辅助完成、有证据支撑的研究交接包                       |

**EN** You may also submit a Pull Request for bilingual scientific content, corrections, code, tests, visualization, accessibility, or documentation.\
**中文** 也可通过 Pull Request 贡献双语科学内容、勘误、代码、测试、图谱可视化、可访问性或文档改进。

### Research Insights contributions | 科研成果解读贡献

**EN** Begin with the [literature catalogue](docs/literature/README.md). To submit literature research without code, use [Literature Research Submission](https://github.com/ZWY-research/Fusion-Research-Atlas/issues/new?template=literature-submission.yml). For a formal paper-page PR, retain the [bilingual review template](docs/literature/REVIEW_TEMPLATE.md). The four existing scientific Issue forms remain available for focused contributions:

**中文** 请先查阅[文献目录](docs/literature/README.md)。无需写代码的文献研究可使用 [Literature Research Submission / 文献研究成果提交](https://github.com/ZWY-research/Fusion-Research-Atlas/issues/new?template=literature-submission.yml)。正式论文页面 PR 仍沿用[双语评议模板](docs/literature/REVIEW_TEMPLATE.md)；原有四种科学 Issue 表单继续用于具体问题和证据贡献：

### Submit a research handoff | 提交研究交接包

1. Obtain a paper you may lawfully access / 获取可合法阅读的论文。
2. Study it manually or use the [GPT/Gemini/Claude dialogue prompt](docs/workflows/research-dialogue-prompt.md). AI assistance is optional / 人工研究，或使用通用科研指令开展 AI 辅助研究；AI 不是贡献的必要条件。
3. Prepare evidence-supported `research-handoff.md` with the prompt's ten sections. If an AI cannot export files, copy its complete Markdown code block and save as UTF-8 / 按指令中的十章节形成有证据支撑的交接文件；AI 不能导出文件时，复制完整 Markdown 代码块并保存为 UTF-8。
4. Sign in to GitHub and paste the complete Markdown or drag the file into the required Research Handoff field of [Literature Research Submission](https://github.com/ZWY-research/Fusion-Research-Atlas/issues/new?template=literature-submission.yml) / 登录 GitHub，在提交表单的 Research Handoff 必填框中粘贴完整内容或拖入文件。
5. Maintainers organise and assess key claims and sources, then decide whether a PR should update formal records and the graph / 维护者整理和评议关键主张与来源后，再决定是否通过 PR 更新正式记录和图谱。

**EN** Focused studies, including one topic within a long review, are welcome. State the actual reading and analysis scope; do not imply full-text checking of material not covered. Key claims need evidence and applicable conditions. AI-generated text is not verified scientific fact. Researchers need no programming, fork, Codex or development tools, and no personal credentials, academic title, affiliation or supervisor approval are requested.

**中文** 允许部分专题研究，包括长篇综述中的一个专题。必须声明实际阅读和分析范围，不得暗示已核查未覆盖的全文。关键主张应有证据和适用条件；AI 生成的文本不是已经核验的科学事实。普通研究者无需编程、Fork、Codex 或安装开发工具，也不要求填写个人身份信息、职称、单位或导师批准。

**EN** Developers and maintainers may use Codex when useful to organise evidence, perform necessary computations, draft formal reviews and prepare graph-update PRs. It is not a prerequisite for researchers to submit.

**中文** 开发者或维护者可按需要通过 Codex 整理证据、开展必要计算、生成正式评议并准备图谱更新 PR；普通研究者提交成果不以使用 Codex 为前提。

| Contribution / 贡献内容                                                                            | Existing route / 现有入口                                                                                                            |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Recommend an original paper worth studying / 推荐值得研究的原始论文                                | Evidence Contribution / 证据贡献                                                                                                     |
| Add a specific finding with its conditions and source locator / 贡献具体科学证据及其条件与原文位置 | Evidence Contribution / 证据贡献                                                                                                     |
| Correct an error or omission in a review / 指出评议中的错误或遗漏                                  | Scientific Challenge, or a focused correction PR / 科学质疑，或勘误 PR                                                               |
| Propose a competing physical explanation / 提出竞争性物理解释                                      | Scientific Challenge / 科学质疑                                                                                                      |
| Add a mathematical, simulation, or experimental verification method / 补充数学、模拟或实验验证方法 | Verification Proposal / 验证提案                                                                                                     |
| Submit a new English–Chinese scientific review / 提交新的中英双语科研成果解读                      | Pull Request; Research Question for unresolved questions raised by the review / Pull Request；评议引出的未解决问题可使用科学问题表单 |

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

### Key-claim evidence record | 关键主张证据记录

**EN** FRA contributions centre on specific scientific claims and their evidence, rather than lengthy paper summaries. Record these eight items for each important claim affecting scientific judgement, using section 04 Evidence and Findings of `research-handoff.md`. Background sentences do not each need a complete record; mark unavailable information as unknown or unchecked rather than inventing it.

**中文** FRA 科学贡献以具体主张及其证据为核心，而非长篇论文总结。在 `research-handoff.md` 的 04 Evidence and Findings 中，对影响科学判断的重要主张记录以下八类信息；无需为每句背景说明填写完整记录，缺失信息明确标为未知或待核实，不得补造。

| Field / 字段                                      | Required information / 必要信息                                                                                                                                                                                                                                                                                                 |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Claim ID / 局部主张编号                           | C01, C02, etc., local to this handoff; not a global FRA finding ID / 仅限本交接文件，不冒充 FRA 全局 finding ID                                                                                                                                                                                                                 |
| Scientific Claim / 科学主张                       | A precise statement of what is claimed / 清楚表述具体科学主张                                                                                                                                                                                                                                                                   |
| Source / 来源                                     | DOI or another stable original source; identify what was actually consulted / DOI 或其他稳定原始来源，注明实际查阅材料                                                                                                                                                                                                          |
| Evidence Locator / 证据位置                       | PDF page, figure, table, equation or section when available / 尽可能提供实际查阅的 PDF 页码、图号、表号、公式编号或章节                                                                                                                                                                                                         |
| Conditions and Assumptions / 条件与假设           | Device, parameter range, theoretical approximations, experimental or simulation conditions / 装置、参数范围、理论近似、实验或模拟条件                                                                                                                                                                                           |
| Claim Type / 主张性质                             | Directly reported result; authors' physical interpretation; contributor or AI independent analysis; unverified new hypothesis / 区分原文直接结果、作者物理解释、贡献者或 AI 独立分析、待验证新假设                                                                                                                              |
| Evidence and Verification Status / 证据与核查状态 | State which bibliographic checks, relevant text/evidence reading, specific claim checks, independent calculations or experimental verification were actually completed and with what evidence; identify unchecked work / 分别说明实际完成的书目核对、相关正文与证据阅读、具体主张检查、独立计算或实验验证及依据，标明待核实事项 |
| Limitations / 局限                                | Main limits affecting the claim and unresolved questions / 影响主张成立的主要局限及未解决问题                                                                                                                                                                                                                                   |

**EN** For review articles, distinguish results summarised by the review's authors from original studies actually read. Without consulting a cited original study, do not claim it has been checked. Reading, contributor/AI analysis and software-test success are not independent scientific verification. An insufficiently supported claim can remain a question to investigate, but cannot be presented as an established conclusion.

**中文** 研究综述时，必须区分综述作者概括的结果与本次实际阅读的原始研究；没有查阅被引原始论文时，不得声称已经核实该原始研究。阅读、贡献者或 AI 分析、软件测试通过均不等于独立科学验证。证据不足的主张可作为待核查问题保留，不能表述为既定结论。

**EN** This is a contribution-writing convention, not a new data schema or status enumeration. Formal ingestion preserves existing `sourceId`/`findingId`, `epistemicStatus` and `verificationStatus`. C01/C02 labels remain local, new source/finding IDs are assigned during ingestion, and Nature citation numbers are generated by the existing system.

**中文** 这是贡献写作规范，不新增数据结构或科学状态枚举。正式入库继续保留已有 `sourceId`/`findingId`、`epistemicStatus` 和 `verificationStatus`。C01/C02 仅在交接文件内有效，新 source/finding ID 由入库工作确定，Nature 引用编号由现有系统生成。

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

**EN** A new Literature Research Submission Issue acknowledges receipt only. It does not automatically change the graph or established conclusions, create verified findings, increase completed-review counts, or mark AI speculation as verified. Maintainers check key claims and sources before deciding on a PR for formal inclusion. Valuable questions with insufficient sources can stay in the Issue for further discussion.

**中文** 新的文献研究成果 Issue 只表示收到贡献，不会自动修改图谱或已建立结论、创建已验证 finding、增加已完成评议统计，或将 AI 推测标为 verified。维护者对关键主张和来源进行必要检查后，再决定是否通过 PR 纳入正式科学记录。来源不足但有价值的问题可留在 Issue 中继续讨论。

[**Start with an Issue · 通过 Issue 参与**](https://github.com/ZWY-research/Fusion-Research-Atlas/issues/new/choose) · [**Back to README · 返回项目首页**](README.md)

## Authors and interdisciplinary collaborators | 作者与跨学科研究者参与

**EN** Authors are welcome to add contributions insufficiently represented in Research Insights, explain experimental conditions or model context, clarify applicability, supply subsequent evidence, propose alternative interpretations, and develop new questions with other disciplines. Please identify the relevant paper, finding, or graph ID and give source locators where possible. Reuse the four existing Issue forms or submit a Pull Request; participation does not require a new author approval process.

**中文** 欢迎作者补充解读中未充分呈现的贡献，说明实验条件或模型背景，澄清适用范围，提供后续证据，提出替代解释，并与其他学科共同发展新问题。请注明相关论文、发现或图谱 ID，尽可能提供原文位置。复用现有四种 Issue 表单或提交 Pull Request，无须另设作者审批制度。
