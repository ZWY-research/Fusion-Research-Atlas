# Fusion Research Atlas — Repository Agent Instructions / FRA 仓库代理指令

## 1. Mission and scope / 使命与范围

FRA is an open, evolving, evidence-driven map of **scientific questions, phenomena, mechanisms, claims, evidence, gaps, and verification paths** in fusion research. Its first deep case is tokamak electron density transport and peaking; the methodology must remain applicable to other fusion fields. Scientific understanding is the goal, not the number of nodes, papers, checks, or agent workflows.

FRA 是面向聚变科学问题的开放、持续演化的证据图谱。首个深入案例为托卡马克电子密度输运与峰化，但规则必须可迁移至其他聚变领域。以新增可靠物理认识为目标，不以节点数量、形式审计或流程复杂度为目标。

## 2. Read the authoritative files when relevant / 按任务读取规范

- `README.md` — project overview and public entry points / 项目定位与公开入口。
- `CONTRIBUTING.md` — human/AI contributions, publication boundaries and review policy / 投稿与正式入库边界。
- `docs/data-model.md` and `src/model.ts` — actual graph schema, IDs, statuses and citations / 图谱真实数据约束。
- `docs/literature/README.md` and `docs/literature/REVIEW_TEMPLATE.md` — literature catalogue, review structure and counts / 文献目录、评议结构与统计。
- `docs/workflows/research-dialogue-prompt.md` — cross-model, claim-level evidence handoff / 跨模型科研交接规范。
- `docs/literature/CITATIONS.md` — Nature-style reference behavior / 引用格式与编号。
- `package.json`, `scripts/`, and `tests/` — executable checks / 实际可执行的检查。

Read only the files needed for the current task. Treat the code and actual schema as authoritative when examples, summaries, or old instructions differ. Do not invent repository paths, state values, commands, or already-completed work.

## 3. Scientific integrity / 科学证据规则

- Separate **source-reported observation/result**, **author interpretation**, **independent mathematical or physical analysis**, **candidate hypothesis**, and **future verification proposal**. Do not silently upgrade one category into another.
- For each decision-relevant claim, preserve source identity (DOI/stable link), precise figure/table/equation/page locator, investigated system and conditions, model assumptions, uncertainty/limitations, and actual reading/verification status. Use local C01/C02 labels in handoffs; assign stable source/finding IDs only using the graph's existing conventions.
- For reviews, a summary of a cited original study is **not** evidence that its original article, experimental data or simulation was inspected. Metadata, abstract, full-text, specific-claim checking and independent reproduction are separate operations.
- An AI-generated argument, software test, valid JSON, or merged PR does **not** constitute independent scientific verification. Preserve competing interpretations and unresolved evidence as such.
- Check whether the DOI, question, source, finding, or review already exists before adding records. Prefer a bounded update over duplication or new architecture.
- Do not change demonstration nodes into established research facts, nor promote `epistemicStatus` or `verificationStatus` without corresponding evidence.

对影响科学判断的主张，必须保留原始定位、成立条件、认识性质及核查状态。区分综述转述与原始研究核查；区分数学推导与物理验证；不把推测、软件验证或 PR 合并当作实验事实。

## 4. Inputs, outputs and task execution / 输入、输出与执行

**Inputs:** Identify the user's concrete goal, provided source files/PDF version or `research-handoff.md`, relevant research question, allowed workspace, and expected deliverable. Confirm referenced local files exist before relying on them. If a material source is absent, describe the gap and complete the scientifically justified part; never fabricate evidence or silently substitute a different document.

**Research outputs:** A public literature study uses the existing **bilingual 11-section** `docs/literature/REVIEW_TEMPLATE.md`; an external research handoff uses the separate **10-section** `research-handoff.md`. Do not confuse them. Reuse original authors and DOI, distinguish PDF page numbers from journal page numbers, and maintain traceable claim locators.

**Graph outputs:** Add the smallest useful source/finding/node/relation changes supported by evidence, conforming to `src/model.ts`. Keep IDs stable, citations targeted, and indexed / completed-study / independently-verified counts distinct. A scientific Issue is an incoming contribution, not an approved graph update.

**Software outputs:** Modify only files related to the task. Prefer existing tools and scripts; avoid new dependencies, agents, skills, databases or broad refactors unless specifically justified by a concrete need.

**Public/private:** Never commit nonpublic experimental data, proprietary PDF copies, credentials, private paths, or unlicensed paper figures. Use DOI links and original interpretation instead.

**Workspace separation:** Commit only approved public outputs to the Git repository. Keep source PDFs, restricted datasets, external research handoffs, temporary calculations, logs and review ZIPs in a separate local task workspace, not in tracked repository paths. The task instruction must identify concrete local input and output directories; never hardcode one contributor’s machine-specific paths in this public `AGENTS.md`. Synchronized storage may be used to archive final deliverables, but is not the default execution workspace.

**工作区分离：** Git 仓库仅保存获准公开的正式成果；原始论文 PDF、受限数据、外部研究交接包、临时计算、日志及审查 ZIP 应存放于独立的本地科研工作区，不放入 Git 跟踪目录。每次任务须明确实际输入和输出路径；公开 `AGENTS.md` 不写死某一贡献者电脑的绝对路径。同步盘可按需归档最终成果，但不作为默认执行工作区。

## 5. Language and scientific writing / 语言与科学表达

- Public scientific content and graph labels must be semantically equivalent in Chinese and English wherever the existing schema/template requires both; preserve source titles, authors, notation and original terminology.
- Do not force an English-language contributor's `research-handoff.md` into Chinese. External handoffs may be Chinese or English; formal FRA pages follow the bilingual review template.
- Write clearly and objectively, state conditions for equations when first introduced, and distinguish results from proposals. Do not invent universal laws from limited correlations or single simulations.

## 6. Verification proportional to changes / 按改动范围验证

- Markdown-only changes: changed-file Prettier check, `git diff --check`, links/anchors and bilingual correspondence as applicable.
- Graph JSON / source / finding changes: `npm run validate:data`, relevant `npm test`, build or type check if code paths are affected; verify DOI/metadata only as actually needed. Validate status semantics manually; schema success is not scientific validity.
- UI/interaction changes: relevant browser tests. Scientific simulations are **not** routine validation for documentation work; run them only for explicitly scoped physics questions with the required inputs.
- Record which checks ran, their outcomes, and what remains unverified. Do not repeatedly run unrelated full suites for small changes.

## 7. GitHub workflow and handoff / PR 与回传规范

- Before editing, inspect `git status`, current branch, up-to-date target branch, existing record/PR duplicates, and user changes. Never overwrite unrelated work or force-push without explicit authorization.
- For a requested research-ingestion task, use a focused branch and an **OPEN PR** by default; do not merge, create a Release, or publish data unless explicitly requested.
- Final report: `READY_FOR_REVIEW` / `BLOCKED` / actual completed state, PR URL (if any), branch and commit SHA, changed files, important scientific claims and status, added/reused source/finding IDs, graph changes, tests run, and remaining evidence gaps.
- For substantial science-data PRs, provide a single review package containing **all changed scientific Markdown/JSON, the PR patch, and concise check results**, stored outside the tracked repository; return its exact path and SHA-256. For a tiny documentation-only change, a PR link and changed files suffice.
- Finish the assigned task. Do not prolong it with unsolicited defensive reviews, new infrastructure, or follow-on PRs.

## 8. Instruction precedence / 指令边界

These are repository defaults, not a substitute for the current user's specific task or higher-priority instructions. More specific valid local instructions may apply in subdirectories; do not create nested `AGENTS.md` unless a real recurring exception demands one. Keep this file compact and stable; place detailed scientific methods in existing domain documentation.
