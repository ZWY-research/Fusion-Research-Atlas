# FRA-02 — Electron-Density Peaking: Cross-Study Comparison and Scope of Scientific Inference

# FRA-02——电子密度峰化：跨研究证据比较与科学结论的成立范围

**Research question / 科学问题:** `q-density`

**Review type / 类型:** FRA independent, source-bounded cross-study synthesis; not a new measurement, simulation, or independent reproduction / FRA 基于已有原文研读记录开展的跨研究综合分析，非新增测量、模拟或独立复现。

**Research baseline / 研究基线:** `ZWY-research/Fusion-Research-Atlas`, `main` at `4fabbf6d198e4870ca7fd86efbd64a29bfa09802`, 2026-10-23.

**Source scope / 来源范围:** Five FRA research pages and their source/finding records; independent primary-paper rereading and independent numerical/experimental reproduction were not undertaken in this FRA-02 synthesis / 使用五篇已入库研究评议及来源 finding，本次综合分析未重新取得原始数据库或独立复现全部原始工作。

**Scientific status / 科学状态:** Review-level, conditional comparative judgments and proposed verification. All five sources retain `independent=not_checked`. No change to the existing graph epistemic statuses.

**Cross-study claim IDs:** `FRA02-C01`…`FRA02-C05` identify conclusions **within this document**, not graph `finding-*` or `verificationStatus` entries.

## 1. Comparison dimensions / 统一比较维度

Each study is described by: (i) question and contribution; (ii) system, regime, sample and source; (iii) observable, coordinate and averaging convention; (iv) diagnostics, analysis and theoretical/numerical tool; (v) observed/inferred/model output; (vi) stated assumptions and study-specific limitations; (vii) type and reach of inference; (viii) relationships and discriminating follow-up. “Not established in the reviewed record” means exactly that, not that a method or dataset does not exist. A **reviewed source claim** is not an **independent physical validation**.

每篇按八个维度记录：研究问题与贡献、装置运行条件与粒子源、观测量定义与坐标平均约定、诊断和理论数值工具、实测或反演或模型结果、假设与限制、可支持的科学推断、与其他研究的联系及可判别的后续任务。“现有记录未确认”不等于相关方法或数据不存在。“已核对来源主张”不等于“已独立物理验证”。

## 2. Primary comparison matrix / 五篇研究的主比较表

| Study / 来源                              | Physical scope and observable / 物理条件及观测量                                                                                                                                                                                                                       | Method / 方法                                                                                                                                                                                                                        | Supported contribution / 原文支持的贡献                                                                                                                                                                                                                                            | Main validity boundary / 成立边界                                                                                                                                                                                                                                                                                   |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Angioni 2003** `paper-angioni-2003`     | AUG stationary NBI H-mode. Fig. 1: `n_e(ρψ=0.4)/n_e(ρψ=0.8)` versus `ν_eff=ν_ei/ω_De`; `k⊥ρ_s=√0.1`. Fig. 2: 30 cases, `0.1≤ν_eff≤2`; later local coefficients use `ρ=aρφ`, a different flux radius. / AUG 稳态 NBI H 模；两半径密度比，后续模型导数采用另一磁通坐标。 | Experimental grouping; ASTRA joint-profile predictions; collisional GLF23 versus Weiland, RGLF, collision-disabled GLF23; incremental flux derivatives; with/without Ware in two models. / 分组观测、ASTRA、GLF23 对比与模型干预。   | Peaking decreases with collisionality in examined regimes; GLF23 collision operator affects model trend; outward diffusion can coexist with inward off-diagonal contributions; Ware matters in specified high-collisionality model cases. / 碰撞性关联、模型碰撞项作用及通量抵消。 | GLF23 ablation is **model-conditional**, not an experimental isolated collision effect; effective pinch is a composite model ratio, not an independent pinch measurement. / 数值消融非实验因果隔离；复合箍缩非独立实测。                                                                                            |
| **Angioni 2007** `paper-angioni-2007`     | 343 AUG + 277 JET **observations** (not proven 620 independent discharges), ELMy H-mode with mixed heating; `pk_ne=n_e(ρpol=0.2)/⟨n_e⟩_Vol`. / AUG/JET 620 个观测，近核心密度与体积平均之比。                                                                          | Five-chord common-inversion reconstruction; empirical regression of collisionality, Greenwald fraction and other covariates; model-dependent NBI source estimates and ITER extrapolation. / 五弦一致性反演、稳健回归、源近似与外推。 | Peaking–collisionality association and covariant Greenwald alternative; different fits can have similar in-sample error yet divergent ITER predictions. / 支持经验关联，但竞争定标外推存在分歧。                                                                                   | Covariate correlation, density inversion and assumed approximately constant heat/particle transport ratio; author manuscript rather than direct formal-published-version numerical cross-check. / 协变量、反演和输运比假设；稿本版本边界。                                                                          |
| **Greenwald 2007** `paper-greenwald-2007` | Alcator C-Mod 51 quasi-steady ELMy ICRF H-mode discharges, **no NBI**, `ν_eff≈0.35–8`; `n_e(0.2)/⟨n_e⟩` and some two-radius ratios. / C-Mod 51 炮 ICRF H 模、无 NBI，使用全局峰化量。                                                                                  | Cross-device out-of-training-set comparison with previous AUG/JET fits; reported common peaking definitions need coordinate verification. / 跨装置经验律外部检验。                                                                   | C-Mod observations add empirical discrimination favouring collisionality over Greenwald fraction for studied conditions; NBI central fuelling is not necessary for the observed peaking. / 增强碰撞性经验支持，排除 NBI 供粒的必要性。                                             | No NBI ≠ zero total source. The letter’s “20% toroidal flux” language is not automatically identical to 2007 AUG/JET’s `ρpol=0.2`; diagnostic/uncertainty pipeline remains incomplete in the reviewed letter. / 坐标与总源账本仍需协调。                                                                            |
| **Mordijck 2020** `paper-mordijck-2020`   | DIII-D **three** H-mode discharges 165303, 165325, 165320; ∼fivefold core collisionality scan, 3 Hz small density modulation, finite NBI fuelling; **local** `R/L_ne`, partly averaged over `ρ≈0.5–0.8`. / 三炮、3 Hz 调制、有束源、局部梯度。                         | TS/reflectometry modulation amplitude and phase; CER, BES/DBS; OMFIT/Gaprofiles; perturbative coefficient inversion, equilibrium-based convection, GENE linear and TGLF-SAT1 spectra. / 多诊断、扰动反演和条件性湍流模拟。           | Lower collisionality accompanied greater peaking and `D_p` reaching ∼8 m²/s; inward transport-to-diffusion balance increased; `D_p` and reconstructed steady diffusion can differ by over factor three in the low case. / 扰动扩散增强仍可伴随峰化增强。                           | Ion-temperature gradients/ITB, `E_r`, fast ions and source also change; perturbation-based `D_p` ≠ steady model diffusivity; inferred convection is not a second independent microscopic measurement; input experimental gradients do not establish held-out profile prediction. / 有混杂、模型逆推与预测能力边界。 |
| **Angioni 2012** `paper-angioni-2012`     | **Survey**, not a fifth independent experiment. Review of particle/momentum off-diagonal flux across AUG/JET/TCV/DIII-D/NSTX/C-Mod and various regimes; local mode-frequency/flux conditions. / 多装置机制综述。                                                       | Analytical gyrokinetic/quasilinear mechanisms and cited experimental/model results, energy resonance, ITG/TEM conditions, finite gradients, momentum constraints. / 动理学、共振和已有成果综合。                                     | Flux coefficients vary with background gradients and resonance/spectral structure; ITG/weak TEM and strong TEM may yield different thermodiffusion signs under specified assumptions; nonmonotonic frequency–peaking associations. / 机制符号与模实频依条件成立。                  | Review-reported results share primary sources; mode sign or frequency alone is not nonlinear saturated particle flux; paper’s nine finding checks inherit a scientific handoff, not independent per-citation rereading. / 非独立实验，未形成谱饱和闭合。                                                            |

**Source locators / 原文位置：** Angioni 2003 Figs. 1–5, Eqs. (1a),(1b),(2) (`finding-2003`, `finding-a03-collision-ablation`, `finding-a03-incremental-flux`, `finding-a03-effective-pinch`, `finding-a03-ware-competition`); Angioni 2007 manuscript §§2–7, Tables 1–4 and Fig. 4 (`finding-a07-covariance`, `finding-a07-source`, `finding-a07-prediction`); Greenwald 2007 L27–L29, Figs. 1–4 (`finding-g07-peaking`, `finding-g07-discrimination`, `finding-g07-transfer`); Mordijck 2020 accepted manuscript pp. 5–21, Figs. 1–18, Eqs. (1)–(10) (`finding-m20-scan`, `finding-m20-modulation`, `finding-m20-tangent-steady`, `finding-m20-source-ratio`, `finding-m20-models`, `finding-m20-coupled-state`); Angioni 2012 §§2–4, Figs. 1–9, Eqs. (1)–(12) (`finding-a12-flux-decomposition`, `finding-a12-resonance-sign`, `finding-a12-frequency-peaking`). Check full bilingual per-paper reviews for page and claim-specific qualifications.

## 3. Cross-study findings: what is and is not comparable / 跨研究的实质判断

### FRA02-C01 — The peaking observables are not mathematically interchangeable / 峰化观测量不可直接互换

**Established identity under stated assumptions / 在明确条件下的数学恒等式：** For positive differentiable electron density `n_e(r)`, fixed major-radius scale `R_0>0`, and the _same physical radial coordinate_ `r`, define the local normalized gradient `G(r)=-R_0 d(ln n_e)/dr`. Then

$$
\ln\!\frac{n_e(r_1)}{n_e(r_2)}=\frac{1}{R_0}\int_{r_1}^{r_2}G(r)\,dr.
$$

The integral spans the same coordinate system; flux-radius conversion requires an equilibrium map and Jacobian. A global two-radius ratio constrains an **integral**, not a local value of `G`. For `pk=n_e(r_0)/⟨n_e⟩_Vol`, the denominator also requires correct flux-surface volume weighting and is not a two-point integral. Infinitely many smooth positive profiles can share the same global ratio but differ in local gradient. This is a direct mathematical conclusion, **not** a numerically verified cross-device mapping.

**中文：** 上式仅在密度为正、可微、`R_0` 固定且使用同一有量纲径向坐标时成立。两点密度比约束的是梯度积分，而不是某一个径向位置的 `R/L_ne`。Angioni 2003 的 `ρψ`、其模型部分的 `ρφ`、Angioni 2007 的 `ρpol` 与 Mordijck 2020 的局部 `R/L_ne` 需要逐一映射。峰化因子若采用体积平均，分母还需要平衡体积权重。不能将不同论文的散点直接合成同一个梯度定标。

**Evidence / 依据：** `paper-angioni-2003` Fig. 1, `paper-angioni-2007` §4, `paper-greenwald-2007` L27–L28, `paper-mordijck-2020` Fig. 11. **Next test / 验证：** obtain authorized matched density profiles, equilibria and uncertainties; compute the published ratios and local gradients from the **same** profiles; test how much inferred scaling differs after harmonization. If unavailable, retain a conditional mathematical relation only.

### FRA02-C02 — Collisionality has empirical cross-device support but no unique isolated cause / 碰撞性经验支持增强，但因果仍未唯一识别

**Source-supported:** AUG’s profile trends and collisional GLF23 model, AUG/JET empirical fits, and C-Mod’s external comparison collectively support a collisionality-associated peaking trend **for the studied regimes**. C-Mod without NBI weakens an explanation relying solely on injected central beam particles. However, Angioni 2007 explicitly retains covariate/Greenwald alternatives; C-Mod changed experimental conditions and collisionality normalization; DIII-D’s three-case scan changes ion gradients, ITB, electric field and fast-ion fraction.

**FRA comparative judgment:** These findings are **compatible but not a single controlled experiment**. GLF23’s collision-term ablation supports the effect **within that model**, not a universal experimental partial derivative at other variables fixed.

**中文：** AUG、AUG/JET、C-Mod 对特定运行态的碰撞性相关经验规律形成递进证据；C-Mod 无 NBI 削弱“束流核心供粒是必要条件”的解释。但 Greenwald 分数、诊断坐标、加热与粒子源、梯度、电场以及模型碰撞算子仍与碰撞性作用存在不同层面的可辨识性问题。上述结果总体相容，尚不能宣称获得普适“纯碰撞因果律”。

**Evidence / 依据：** `finding-2003`, `finding-a03-collision-ablation`, `finding-a07-covariance`, `finding-a07-prediction`, `finding-g07-discrimination`, `finding-g07-transfer`, `finding-m20-coupled-state`. **Future discriminator / 判别：** harmonized predictors and uncertainty, cross-device held-out prediction, then fixed-background collision/operator scans explicitly contrasted with co-varied experimental paths. No new simulations performed in FRA-02.

### FRA02-C03 — Stronger perturbative diffusion and stronger peaking are not contradictory / 扰动扩散增强与峰化增强并不矛盾

**Declared local illustrative closure / 用于逻辑分析的局域模型，非原文系数换算：** With outward-positive particle flux, positive density `n_e`, diffusivity `D>0`, local gradient `G=-R_0 d\ln n_e/dr`, and a composite non-diffusive velocity `V_eff` defined for the same state,

$$
\Gamma=-D\frac{dn_e}{dr}+n_eV_{\rm eff},\qquad
G=\frac{R_0}{D}\left(\frac{\Gamma_{\rm req}}{n_e}-V_{\rm eff}\right).
$$

Here `Γ_req` is the steady flux required by the continuity/source/boundary balance, `V_eff` may include thermodiffusive and other contributions **by explicit convention**, and `D,V_eff` need not stay fixed when profiles change. Thus an increase in `D` alone does not determine whether `G` increases or decreases. **This algebraic identity does not justify setting `D=D_p` or treating `V_eff` as a pure independently measured microscopic pinch.**

**中文：** 上式指出：在固定坐标、向外为正、同一局域稳态闭合下，梯度取决于源所要求的通量、扩散和全部非扩散贡献。`D` 变大并不排除向内输运比更强而使梯度更陡。Mordijck 2020 的 `D_p` 是扰动反演，稳态系数来自额外重建假设，因此不能把上述恒等式中的 `D` 无条件替换为 `D_p`。Angioni 2003 的增量导数/复合箍缩与 Mordijck 的扰动/稳态系数不是同一可测量对象。

**Evidence / 依据：** `finding-a03-incremental-flux`, `finding-a03-effective-pinch`, `finding-m20-modulation`, `finding-m20-tangent-steady`, `finding-m20-source-ratio`. **Next test / 验证：** constrain `Γ_req` with source and boundary uncertainties, propagate amplitude/phase covariance; reconstruct a family of admissible closures and demand prediction of an independent perturbation or density profile. No new numeric inversion performed.

### FRA02-C04 — Model explanation is not held-out predictive validation / 机制解释不等于独立预测

GLF23 collisional versus noncollisional calculations (2003) are conditional model interventions; AUG/JET fits (2007) can agree in-sample but extrapolate differently; C-Mod adds an important out-of-training-device check, **not** a proof of microscopic closure. In 2020, linear GENE omits `E×B` shear, TGLF-SAT1 conditions on experimentally supplied gradients, and BES/DBS observe fluctuation amplitudes rather than the complete signed density–radial-velocity cross phase. The 2012 frequency/ITG/TEM discussion distinguishes theoretical resonance channels but not a complete nonlinear saturated flux. Therefore these tools answer **different validation questions**, and apparent model agreement should not be pooled as five identical tests.

**中文：** 模型消融、经验定标外推、新装置检验、给定实测剖面的湍流计算和非线性剖面预测属于不同层次。现有论文并未共同完成“从源、几何与边界独立预测留出放电的密度剖面”的统一检验。不同工具的可支持范围应与原文事实分开列示，不以模型局限指称原论文错误。

**Evidence / 依据：** `finding-a03-collision-ablation`, `finding-a07-prediction`, `finding-g07-transfer`, `finding-m20-models`, `finding-a12-resonance-sign`, `finding-a12-frequency-peaking`. **Next test / 验证：** use the same fixed inputs, geometry, diagnostics and uncertainty conventions for held-out profile predictions; compare empirical baselines and mechanistic closures, measuring _predicted observables_ rather than a matched mode label.

### FRA02-C05 — Similar observations do not constitute independent replications / 不能按论文篇数计算独立验证次数

Angioni 2012 surveys earlier papers; Angioni 2003/2007 and Greenwald 2007 form partly shared analytical and reference chains; DIII-D 2020 addresses a different local and perturbative observable. **Five source-based literature reviews ≠ five independent experimental replications.** Current FRA `verificationStatus.independent` remains `not_checked` for all five. Publication, reading, checking claims and software tests do not establish independent numerical reproduction or a new-data replication.

**中文：** 五篇资料之间存在综述转述、原始研究与后续外部检验的层次。已完成五篇深入研读不意味着完成五次独立科学验证。FRA-02 只开展来源可追溯的比较推理，不能提高现有独立验证状态。

## 4. V&V and reproducibility vocabulary / 科学有效性术语

Use ASME VVUQ's _verification_ for whether numerical implementation solves the **specified equations** correctly, and _validation_ for agreement of a model with **specified physical experimental observations and uncertainties**. The 2019 National Academies report distinguishes _computational reproducibility_ (same data, code, method, analysis conditions) from _replicability_ (new data studies of the same question). These terms are **not aliases for** DOI verified, original paper read, source claim checked or CI succeeded. No credibility scores or researcher ranking are assigned.

遵循 ASME 的“实现与指定方程一致性”及“模型与实测的指定条件适用性”区分，并按美国国家科学院 2019 年定义区分同一数据计算复现和独立新数据重复研究。这里仅用于评价证据链，**不改动** FRA 原 `verificationStatus`，不引入科研可信度分数，不评价研究者个人。

Sources / 方法参考：

- ORKG Comparison Course: https://academy.orkg.org/courses/comparison-course.html
- ORKG comparison with existing papers: https://academy.orkg.org/tutorials/comparison-tutorial-ii.html
- ASME VVUQ: https://www.asme.org/codes-standards/publications-information/verification-validation-uncertainty
- NASEM (2019), _Reproducibility and Replicability in Science_: https://www.nationalacademies.org/read/25303/chapter/3

## 5. Priority research question and verification sequence / 优先研究问题与验证路径

**Research question / 研究问题:** Under a consistent coordinate, comparable peaking observable and source-constrained particle balance, which statements about the collisionality dependence of density peaking remain predictive, and which require distinct closure assumptions? / 当径向坐标、峰化定义及有限源平衡协调后，碰撞性峰化经验规律哪些仍能预测，哪些取决于额外的输运闭合假设？

1. **Observable alignment / 观测量协调（首选、最低成本）:** Specify `ρψ`, `ρpol`, `ρφ`, `r/a`, `R_0` and volume averages; obtain profile+equilibrium uncertainty inputs before comparing a local `R/L_ne` to global `pk`. Compute both metrics per **same physical profile** and propagate uncertainty. Required source checks: Angioni 2003 Fig. 1; Angioni 2007 §4; Greenwald 2007 Eq. (1) and L28 coordinate language; Mordijck 2020 Fig. 11. **Discriminator:** whether a purported difference survives measurement-definition harmonization. Current status: **proposed, not executed**.
2. **Empirical transfer / 经验迁移:** Freeze candidate collisionality and Greenwald predictors, source proxies and experimental group boundaries; compare discharges or devices excluded from fitting, never treating repeated time observations as independent discharges without evidence. **Discriminator:** truly out-of-sample predictions under matched definitions versus an in-sample correlation. Current status: **proposed**.
3. **Finite-source closure identification / 有限源闭合辨识:** At fixed geometry and independently characterized source/boundary conditions, estimate `Γ_req`, compare steady flux with modulation-derived tangent response; vary source model, phase fit and `V_eff` gradients within uncertainty. **Discriminator:** whether one closure family predicts an independent perturbation and held-out steady profile. Current status: **proposed**.
4. **Conditional turbulence mechanism / 湍流机制:** Only after necessary data exist, compare fixed-background collisionality/operator scans against observed co-varying state scans, including gradients, ITB/shear and fast-ion effects; distinguish linear mode output and signed nonlinear flux. **Discriminator:** distinctive signed flux and density-profile predictions. Current status: **proposed; no GENE/QuaLiKiz execution authorized or performed in FRA-02**.

**Available now / 当前可完成：** Define and prove integral-vs-local observable relation, create condition-alignment schema at the Markdown level, list exact requested physical data and discriminating tests, and present a source-cited comparison.

**Unavailable in FRA source records / 现有记录不足：** Complete shot-level raw databases, all coordinate maps, source covariance, alternative fitted coefficient samples, independently repeated code runs and newly collected data. Their absence from FRA records is **not** a finding of scientific irreproducibility or misconduct.

## 6. Cross-study relationship register / 跨研究关系登记

| Pair / 对比                        | Relationship / 关系                                                                   | Why / 科学依据                                                                                                        | Further evidence / 后续证据                                                    |
| ---------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Angioni 2003 ↔ Angioni 2007        | Complementary / 互补                                                                  | Model collision effects versus multi-device empirical regression / 机制模型与统计经验不同层次                         | Harmonized observables and model-conditioned comparisons / 统一观测与条件      |
| Angioni 2007 ↔ Greenwald 2007      | Qualified external support / 有条件外部支持                                           | C-Mod outside original training set extends empirical predictor comparison / C-Mod 在原拟合外                         | Cross-device coordinates, diagnostic pipeline and uncertainty / 坐标诊断及误差 |
| Angioni 2007 ↔ Mordijck 2020       | Non-identical outcome / 观测量不同                                                    | Global density ratio versus local profile gradient/perturbative coefficients / 全局比值与局部梯度、扰动系数           | Equilibrium/profile mapping and source balance / 平衡剖面与源                  |
| Angioni 2003 ↔ Mordijck 2020       | Apparent tension explained by closure distinctions / 表面差异需区分闭合               | GLF23 incremental ratio versus measured perturbative `D_p` plus reconstructed steady coefficient / 增量与扰动定义不同 | Consistent tangent/steady/finite-source calculation / 一致计算                 |
| Angioni 2012 ↔ all primary studies | Theory-and-review context, **not independent replication** / 理论综述语境，非独立验证 | Resonance, gradient and multi-mode theory conditionally interprets observations / 有条件机制分析                      | Primary cited study, spectral weights, nonlinear closure / 原始研究与谱闭合    |

There is **no demonstrated direct contradiction** between these five reviewed records after accounting for their different observables and assumptions. This is an assessment of the **current comparison evidence**, not proof that all models agree or that conflicts are absent in the wider literature.

在现有研读范围内，未识别到排除观测量及适用条件差异后仍成立的直接实证冲突。这不等于全部模型一致，也不等于领域内不存在其他反证。

## 7. Implementation guidance and bounded status / 工程与科研状态边界

Publish this synthesis as a **bilingual Markdown research comparison record** under `docs/literature/comparisons/`, link it from FRA-01 and the literature catalogue. A comparison UI may show a **five-study table** driven primarily by the same Atlas `sources`, `reportedFindings`, and citation objects and a **small curated source/finding ID-to-column map** for study-type, method and observable descriptors not available in the JSON. Do not create a parallel scientific database; scientific interpretation and analytical claims reside here, with explicit links to paper studies. Do not add findings to source papers to pretend independent cross-study deductions are author-reported findings. Do not change the 31/53/5 graph or 5/5/0 counts. No FRA-03, no publication/release, and no independent replication claim.

以双语 Markdown 保存完整比较研究，网站只展示源自同一图谱数据的简明矩阵，并链接该分析及原论文评议。若为方法标签需要极少量策划映射，须保持 source/finding ID 和人工判断性质，不能复制完整科学事实成第二套数据库。跨论文 FRA 判断不可冒充作者 finding；原图谱状态、计数及独立验证维度保持不变。

## 8. Primary study links / 五篇来源

- [Angioni et al. 2003, _Physical Review Letters_ 90, 205003](https://doi.org/10.1103/physrevlett.90.205003); FRA: [Research study / 科研评议](../papers/angioni-2003.md).
- [Angioni et al. 2007, _Nuclear Fusion_ 47](https://doi.org/10.1088/0029-5515/47/9/033); FRA: [Research study / 科研评议](../papers/angioni-2007.md).
- [Greenwald et al. 2007, _Nuclear Fusion_ 47](https://doi.org/10.1088/0029-5515/47/9/l03); FRA: [Research study / 科研评议](../papers/greenwald-2007.md).
- [Mordijck et al. 2020, _Nuclear Fusion_](https://doi.org/10.1088/1741-4326/ab81aa); FRA: [Research study / 科研评议](../papers/mordijck-2020.md).
- [Angioni et al. 2012, _Nuclear Fusion_ 52, 114003](https://doi.org/10.1088/0029-5515/52/11/114003); FRA: [Research study / 科研评议](../papers/angioni-2012-off-diagonal-transport.md).

## 9. Ingestion provenance and finding locators / 入库版本与发现定位

**EN** The supplied bilingual synthesis was ingested with Markdown formatting and relative-link adaptation only. Input SHA-256: `86bd0a3edc77c4ce6ea4d47f4c6ab450e388d31ad9de6d41e981cc1377d3e005`. The following locators come from unchanged Atlas source records at the research baseline. They do not record new primary-paper reading.

**中文** 本文采用指定完整双语底稿，仅适配 Markdown 格式、数学显示分隔符与相对链接。输入 SHA-256 如上。下表定位取自研究基线中未修改的 Atlas 来源记录，不代表本次重新阅读原论文。

| Source / 来源          | Finding ID / 发现                | Locator / 原文位置（EN / 中文）                                                                                                                                                                |
| ---------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `paper-angioni-2003`   | `finding-2003`                   | PDF p.1, Fig. 1(a,b), caption/text; p.2 opening; journal pp.205003-1–2; handoff C01/C02. / PDF 第 1 页 Fig. 1(a,b)、图注及正文；第 2 页开头；期刊 205003-1–2；交接 C01/C02。                   |
| `paper-angioni-2003`   | `finding-a03-collision-ablation` | PDF p.2, Fig. 2(a–c) and model description; p.3 first left-column paragraph; journal pp.205003-2–3; C03/C04. / PDF 第 2 页 Fig. 2(a–c) 及模型说明，第 3 页左栏首段；期刊 205003-2–3；C03/C04。 |
| `paper-angioni-2003`   | `finding-a03-incremental-flux`   | PDF p.3, Eqs. (1a),(1b), Fig. 3 and right column; journal p.205003-3; C06. / PDF 第 3 页 Eqs. (1a),(1b)、Fig. 3 及右栏；期刊 205003-3；C06。                                                   |
| `paper-angioni-2003`   | `finding-a03-effective-pinch`    | PDF p.4, Eq. (2), Fig. 4 and left-column explanation; journal p.205003-4; C07. / PDF 第 4 页 Eq. (2)、Fig. 4 及左栏说明；期刊 205003-4；C07。                                                  |
| `paper-angioni-2003`   | `finding-a03-ware-competition`   | PDF p.4, Fig. 5, caption and left-column discussion; journal p.205003-4; C08. / PDF 第 4 页 Fig. 5、图注及左栏讨论；期刊 205003-4；C08。                                                       |
| `paper-angioni-2007`   | `finding-a07-covariance`         | Manuscript §5, Table 2; §6.1, pp. 11–12; A07-C03/C05 / 作者稿第 5 节、表 2；第 6.1 节，第 11—12 页；A07-C03/C05                                                                                |
| `paper-angioni-2007`   | `finding-a07-source`             | Manuscript §3, Eqs. (1)–(2); §6; A07-C06 / 作者稿第 3 节、式（1）—（2）；第 6 节；A07-C06                                                                                                      |
| `paper-angioni-2007`   | `finding-a07-prediction`         | Manuscript §7, Eqs. (3)–(5), Fig. 4; A07-C07 / 作者稿第 7 节、式（3）—（5）、图 4；A07-C07                                                                                                     |
| `paper-greenwald-2007` | `finding-g07-peaking`            | Journal L27, §1, Fig. 1; L29, §3; G07-C01 / 原刊 L27，第 1 节、图 1；L29，第 3 节；G07-C01                                                                                                     |
| `paper-greenwald-2007` | `finding-g07-discrimination`     | Journal L27–L28, §2, Figs. 2–3; G07-C02/C03 / 原刊 L27—L28，第 2 节、图 2—3；G07-C02/C03                                                                                                       |
| `paper-greenwald-2007` | `finding-g07-transfer`           | Journal L28, §2, Eq. (1); L29, Fig. 4; G07-C04 / 原刊 L28，第 2 节、式（1）；L29，图 4；G07-C04                                                                                                |
| `paper-mordijck-2020`  | `finding-m20-scan`               | Accepted PDF pp.5–8, Table 1, Figs.1–6; M20-C01 / 接受稿 PDF 第 5—8 页，表 1、图 1—6；M20-C01                                                                                                  |
| `paper-mordijck-2020`  | `finding-m20-modulation`         | Accepted PDF pp.9–13, Eqs.(1)–(5), Figs.7–10; M20-C02 / 接受稿 PDF 第 9—13 页，式（1）—（5）、图 7—10；M20-C02                                                                                 |
| `paper-mordijck-2020`  | `finding-m20-tangent-steady`     | Accepted PDF pp.13–14,20, Eqs.(8)–(9), §§3.3,6.4; M20-C03 / 接受稿 PDF 第 13—14、20 页，式（8）—（9）、第 3.3 与 6.4 节；M20-C03                                                               |
| `paper-mordijck-2020`  | `finding-m20-source-ratio`       | Accepted PDF p.14, Eq.(10), Fig.11, §4; M20-C04 / 接受稿 PDF 第 14 页，式（10）、图 11、第 4 节；M20-C04                                                                                       |
| `paper-mordijck-2020`  | `finding-m20-models`             | Accepted PDF pp.15–17,20–21, Figs.12–14,18, §§5–7; M20-C05/C07 / 接受稿 PDF 第 15—17、20—21 页，图 12—14、18，第 5—7 节；M20-C05/C07                                                           |
| `paper-mordijck-2020`  | `finding-m20-coupled-state`      | Accepted PDF pp.7–8,17–21, Figs.5–6,15–18, §§6–7; M20-C06 / 接受稿 PDF 第 7—8、17—21 页，图 5—6、15—18，第 6—7 节；M20-C06                                                                     |
| `paper-angioni-2012`   | `finding-a12-flux-decomposition` | §§2–3, Eqs. (1),(2),(5); PDF pp.3–5 / journal pp.2–4; handoff C01/C03 / §2–3，Eqs. (1),(2),(5)；PDF 3–5 / 期刊 2–4；交接 C01/C03                                                               |
| `paper-angioni-2012`   | `finding-a12-resonance-sign`     | §§3.1–3.3, Eq. (8), Fig. 2; PDF pp.5–7 / journal pp.4–6; C05 / §3.1–3.3，Eq. (8)，Fig. 2；PDF 5–7 / 期刊 4–6；C05                                                                              |
| `paper-angioni-2012`   | `finding-a12-frequency-peaking`  | §3.3, Fig. 3(a–c) and caption; PDF pp.7–8 / journal pp.6–7; C06; review refs. [51,63,43] / §3.3，Fig. 3(a–c) 及图注；PDF 7–8 / 期刊 6–7；C06；综述引文 [51,63,43]                              |
| `paper-angioni-2012`   | `finding-a12-energy-selection`   | §§3.1–3.2, Eq. (8), Figs. 1–2; PDF pp.5–7 / journal pp.4–6; C04 / §3.1–3.2，Eq. (8)，Figs. 1–2；PDF 5–7 / 期刊 4–6；C04                                                                        |
