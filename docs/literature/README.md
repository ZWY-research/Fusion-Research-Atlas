# Scientific Literature Reviews | 科学文献评议

[Project README / 项目首页](../../README.md) · [Contribution guide / 贡献指南](../../CONTRIBUTING.md) · [Review template / 评议模板](REVIEW_TEMPLATE.md) · [Atlas question q-density / 图谱问题 q-density](https://zwy-research.github.io/Fusion-Research-Atlas/#q-density)

**EN** This catalogue connects original papers to FRA's scientific questions and evidence records across the eight existing research domains. Paper pages preserve the DOI, graph identifiers, source scope, and actual review status. Angioni 2007 now has a completed review of the identified 22-page institutional author manuscript; Angioni 2003 remains at bibliographic/abstract scope. Version-of-record concordance and independent scientific verification remain separate, unfinished checks.

**中文** 本目录按 FRA 现有八个研究领域，将原始论文连接至科学问题与证据记录。论文页面保留 DOI、图谱标识、来源范围和实际评议状态。Angioni 2007 已完成对明确的 22 页机构作者稿的科学评议，Angioni 2003 仍为书目及摘要级范围。正式发表版本一致性与独立科学验证是另行记录、尚未完成的检查。

## Status and counts | 状态与统计

| Status / 状态                                                                  | Distinct papers / 去重论文数 | Meaning / 含义                                                                                                                                                                  |
| ------------------------------------------------------------------------------ | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Indexed Papers / 已收录论文](#indexed-papers)                                 | **2**                        | A traceable literature record exists / 已建立可追溯文献记录                                                                                                                     |
| [Completed Scientific Reviews / 已完成科学评议](#completed-scientific-reviews) | **1**                        | The paper's full text and relevant scientific claims have actually been systematically studied and reviewed / 已实际完成论文正文及相关科学主张的系统研究与评议                  |
| [Independently Verified / 已完成独立验证](#independently-verified)             | **0**                        | Specified scientific results have an evidenced independent recheck, computational reproduction, or experimental test / 对明确科研结果已有具备证据的独立复核、计算复现或实验检验 |

**EN** Status as of 12 October 2026, based on the [existing source records](../../public/data/electron-density.json) and the paper pages below. Count each normalised DOI once (or a stable source ID for a paper without a DOI), irrespective of domain assignments. These are separate progress measures; independent verification must identify the result and the extent actually tested. DOI validation is not scientific review, and review is not independent verification.

**中文** 状态截至 2026 年 10 月 12 日，依据[现有来源记录](../../public/data/electron-density.json)及下列论文页面。按规范化 DOI 去重，无 DOI 时按稳定来源 ID 去重，不累加领域关联次数。这些指标分别反映不同工作；独立验证必须注明实际检验的结果与范围。DOI 核验不等于科学评议，评议不等于独立验证。

<a id="indexed-papers"></a>

## Indexed Papers | 已收录论文

| Paper / 论文                                                                                                                                           | DOI                                                                            | FRA source ID / 来源标识 | Actual scope and status / 实际范围与状态                                                                               |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| [Angioni et al. (2003): Density Peaking, Anomalous Pinch, and Collisionality in Tokamak Plasmas](papers/angioni-2003.md)                               | [10.1103/PhysRevLett.90.205003](https://doi.org/10.1103/PhysRevLett.90.205003) | `paper-angioni-2003`     | Metadata and abstract checked; pending full-text review / 已检查书目和摘要；待全文评议                                 |
| [Angioni et al. (2007): Scaling of density peaking in H-mode plasmas based on a combined database of AUG and JET observations](papers/angioni-2007.md) | [10.1088/0029-5515/47/9/033](https://doi.org/10.1088/0029-5515/47/9/033)       | `paper-angioni-2007`     | Completed review of the institutional author manuscript; not independently verified / 已完成机构作者稿评议；未独立验证 |

<a id="completed-scientific-reviews"></a>

## Completed Scientific Reviews | 已完成科学评议

**1 — [Angioni et al. (2007) / Angioni 等（2007）](papers/angioni-2007.md).**

**EN** Review FRA-Q001-R01-A01 covers the complete 22-page Max Planck institutional author manuscript, four figures, four tables, five numbered equations and nine source-located claims. It distinguishes the global peaking observable, conditional source attribution and competing ITER extrapolations. Numerical concordance with the journal version remains unverified; independent reproduction was not performed. Angioni 2003 remains pending.

**中文** FRA-Q001-R01-A01 覆盖 Max Planck 22 页机构作者稿全文、四图、四表、五个编号方程及九项已定位主张，区分全局峰化观测量、有条件的源归因与竞争 ITER 外推。与期刊版本的数值一致性尚未核实，没有开展独立复现。Angioni 2003 仍待评议。

**EN** The Markdown page records the new review. The unchanged JSON remains the historical graph-data snapshot with metadata/abstract checks; this review does not promote graph claims or verification flags.

**中文** Markdown 页面记录本次新增评议；未修改的 JSON 仍是书目/摘要检查的历史图谱快照。本次评议不提升图谱主张或验证标记。

<a id="independently-verified"></a>

## Independently Verified | 已完成独立验证

**0 — No independently verified results recorded yet / 暂无已完成独立验证的结果记录。**

**EN** No independent reproduction or scientific validation is recorded for either indexed paper. Their links to the demonstration graph are contextual citations, not verified support for graph claims.

**中文** 两篇论文均未记录独立复现或科学验证。它们与演示图谱的关联属于背景引用，不代表图谱主张已得到验证。

## Browse by research domain | 按研究领域浏览

**EN** Domain names and IDs follow the [current FRA framework](../../src/content/framework.json). A paper may appear in multiple domains; these links point to one canonical paper page and must not be summed as additional papers. Both initial records have primary scope in transport and a contextual association with turbulence through `q-density`; this association does not establish a turbulence mechanism.

**中文** 领域名称与 ID 沿用[现有 FRA 框架](../../src/content/framework.json)。同一篇论文可关联多个领域，但链接均指向唯一论文页面，不额外计数。两篇初始记录主要属于输运领域，并通过 `q-density` 与湍流领域具有背景关联；这一关联不代表湍流机制得到证实。

### 1. Particle, Heat & Momentum Transport | 粒子、热量与动量输运

Domain ID / 领域标识：`transport`。Indexed / 已收录：2；completed reviews / 已完成评议：1。

- [Angioni et al. (2003) / Angioni 等（2003）](papers/angioni-2003.md) — Pending full-text review / 待全文评议。
- [Angioni et al. (2007) / Angioni 等（2007）](papers/angioni-2007.md) — Completed manuscript review; not independently verified / 已完成作者稿评议；未独立验证。

One completed manuscript review: Angioni 2007; the same paper is counted once across domains / 一篇已完成作者稿评议：Angioni 2007；跨领域仍只计一次。

### 2. Turbulence & Microinstabilities | 湍流与微观不稳定性

Domain ID / 领域标识：`turbulence`。Indexed / 已收录：2；completed reviews / 已完成评议：1。

- [Angioni et al. (2003) / Angioni 等（2003）](papers/angioni-2003.md) — Context for q-density; Pending full-text review / q-density 研究背景；待全文评议。
- [Angioni et al. (2007) / Angioni 等（2007）](papers/angioni-2007.md) — Context for q-density; completed manuscript review / q-density 研究背景；已完成作者稿评议。

One completed manuscript review: Angioni 2007; the same paper is counted once across domains / 一篇已完成作者稿评议：Angioni 2007；跨领域仍只计一次。

### 3. MHD & Plasma Stability | MHD 与等离子体稳定性

Domain ID / 领域标识：`mhd`。No indexed papers yet / 暂无已收录论文。No reviewed papers yet / 暂无已完成评议的论文。

### 4. Heating & Current Drive | 加热与电流驱动

Domain ID / 领域标识：`heating`。No indexed papers yet / 暂无已收录论文。No reviewed papers yet / 暂无已完成评议的论文。

### 5. Edge & Plasma-Wall Interaction | 边缘与等离子体壁相互作用

Domain ID / 领域标识：`edge`。No indexed papers yet / 暂无已收录论文。No reviewed papers yet / 暂无已完成评议的论文。

### 6. Burning Plasma Physics | 燃烧等离子体物理

Domain ID / 领域标识：`burning`。No indexed papers yet / 暂无已收录论文。No reviewed papers yet / 暂无已完成评议的论文。

### 7. Plasma Diagnostics & Measurements | 等离子体诊断与测量

Domain ID / 领域标识：`diagnostics`。No indexed papers yet / 暂无已收录论文。No reviewed papers yet / 暂无已完成评议的论文。

### 8. Integrated Modeling & Control | 集成建模与控制

Domain ID / 领域标识：`modeling`。No indexed papers yet / 暂无已收录论文。No reviewed papers yet / 暂无已完成评议的论文。

## Add a paper or review | 新增论文或评议

**EN** Reuse the [bilingual template](REVIEW_TEMPLATE.md), create one paper file in `papers/`, link it in the indexed list and relevant domains, then update the distinct-paper counts here and in the [project README](../../README.md) if the actual status warrants it. Retain existing source/finding IDs and connect related FRA questions. Use the [four existing Issue forms or a Pull Request](../../CONTRIBUTING.md) to contribute papers, evidence, challenges, verification tasks, or complete reviews. Research findings may enter the graph later once their claims and scope have been assessed.

**中文** 复用[双语模板](REVIEW_TEMPLATE.md)，在 `papers/` 创建唯一论文文件，将其加入收录列表与相关领域，再根据实际完成状态同步更新本目录及[项目 README](../../README.md)的去重统计。保留已有来源和发现 ID，关联 FRA 科学问题。通过[现有四种 Issue 表单或 Pull Request](../../CONTRIBUTING.md)贡献论文、证据、质疑、验证任务或完整评议。研究发现经主张和适用范围核验后，再逐步加入图谱。
