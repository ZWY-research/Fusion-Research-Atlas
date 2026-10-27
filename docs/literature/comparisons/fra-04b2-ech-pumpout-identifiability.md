# FRA-04B2：早期 ECH pump-out 的机制可辨识性 / Mechanism identifiability of early ECH pump-out

[Catalogue / 文献目录](../README.md) · [Evidence matrix: C01–C32 / 32项证据矩阵](fra-04b2-evidence-matrix.csv) · [q-density / 科学问题](https://zwy-research.github.io/Fusion-Research-Atlas/#q-density)

**中文｜INCONCLUSIVE。** Wang 2017 报告的时序不支持“初始外侧 density pump-out 必须等待 ITG/TEM 主导模态转换”；但现有观测不足以唯一分离湍流电势谱权重变化与有符号电子响应核变化。本文整理 FRA-04B2 于2026-10-26形成的本地研究，不增加完成文献研读或独立物理验证统计。Wang期刊论文作者稿的正文与图注已读，原始PDF图像仍未完成核查。

**EN | INCONCLUSIVE.** The timing reported by Wang et al. does not support a dominant ITG/TEM conversion being necessary to initiate the outer-region density pump-out. Available observations do not uniquely separate changes in potential spectral weights from changes in the signed electron response kernel. This note curates the FRA-04B2 research of 26 October 2026; it adds no completed literature study or independent physical verification. Wang's journal-article manuscript text and captions were read; its original PDF figure images remain unchecked.

## Why This Study Matters | 为什么选择这项研究？

**中文** 末态的ITG/TEM差别不能代替初始过程的因果时序。需要区分密度储存、粒子源、通量散度、密度涨落功率以及有符号粒子通量；每一种量约束的机制不同。[1] 本文的观察和模型主张均保持原作者报告的性质，独立分析与候选解释另列。

**EN** A difference between initial and final turbulence regimes does not establish the causal ordering at onset. Density storage, sources, flux divergence, fluctuation power and signed particle flux constrain different objects.[1] Source-reported observations and model results remain distinct from FRA analysis and candidate mechanisms.

## Key Contributions at a Glance | 主要科学贡献概览

- **中文** 以作者稿pp.3–14、图1–14的正文/图注重建有径向区别的时序，不把约80、100、150 ms合并为单一精确转换时刻；原图核查待完成。**EN** Manuscript pp.3–14 and captions to Figs.1–14 support a radially resolved reported chronology; the approximate 80, 100 and 150 ms figures are not a single precise transition time. Image checking remains pending.
- **中文** 固定归一化的有符号谱分解说明为什么密度涨落增强不能单独识别电势振幅或响应核；属条件数学分析。**EN** A consistently normalized signed spectral decomposition explains why density fluctuation enhancement alone identifies neither potential intensity nor the response kernel; this is conditional mathematical analysis.
- **中文** 保留全部C01–C32、原文定位、条件与原有核查状态于伴随CSV；所有标签只在本文使用。**EN** The companion CSV preserves all C01–C32 claims, locators, conditions and original verification states. These are local labels, not graph findings.

## 1. Bibliographic Information | 论文基本信息

| Field / 字段              | Entry / 内容                                                                                                                                                                                                                                  |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Main source / 主要来源    | Wang, X., Mordijck, S., Doyle, E. J., Rhodes, T. L., Zeng, L., McKee, G. R., Austin, M. E., Meneghini, O., Staebler, G. M. & Smith, S. P. Understanding ECH density pump-out in DIII-D H-mode plasmas / 理解DIII-D H模等离子体中的ECH密度泵出 |
| Publication / 出版        | _Nucl. Fusion_ **57**(11), 116046 (2017); DOI [10.1088/1741-4326/aa7f99](https://doi.org/10.1088/1741-4326/aa7f99)                                                                                                                            |
| Version / 版本            | OSTI 1374571, NF-101849.R1, 16 PDF pages / 16页作者稿；all page locators below refer to this manuscript, not journal pagination / 下文页码均为此稿PDF页码                                                                                     |
| System / 系统             | Low-density, low-collisionality lower-single-null DIII-D H-mode / 低密度、低碰撞率下单零H模；ν*≈0.1–0.2, ne≈(2.1–2.7)×10^19 m^-3, BT=1.88 T, IP=1.1 MA, q95≈4.2; source-reported, not reconstructed / 原文报告，未重建输入                    |
| Question / 问题           | Existing q-density / 既有电子密度输运问题；transport and confinement / 输运与约束                                                                                                                                                             |
| Graph records / 图谱记录  | No new source/finding IDs or JSON changes / 不新增来源、发现ID或JSON；DOIs are bibliographic references only / DOI仅作参考文献                                                                                                                |
| Reading status / 研读状态 | Partial source verification; no promotion of completed-study or independent-verification status / 来源核查部分完成，不提升统计或验证状态                                                                                                      |

**中文** 辅助来源限于Fable 2010、Mlynek 2012和Angioni 2011；实际阅读范围见§11。[2–4] FRA-04A是研究者提供的既有会话认识，无独立历史文件，不作独立图像核验依据（C30）。

**EN** Supporting sources are limited to Fable 2010, Mlynek 2012 and Angioni 2011, with actual reading scope in §11.[2–4] FRA-04A is researcher-supplied prior discussion without a standalone historical file; it is not independent image verification (C30).

## 2. Scientific Question | 核心科学问题

**中文** 为什么外侧初始密度下降可以早于主导线性模态转换？H1为电势振幅/相对谱权重变化，H2为电子非绝热响应核的幅度、相位或共振权重变化，H3为有效源、边界及径向剖面演化。它们可以共存；本研究判断其必要条件和观测可辨识性，不强选唯一解释。

**EN** Why can the initial outer-region density decrease precede the dominant linear-mode conversion? H1 concerns potential intensity and relative spectral weights; H2 concerns response magnitude, phase and resonance weighting; H3 concerns effective sources, boundaries and radial profile evolution. These mechanisms may coexist. The question concerns necessary conditions and identifiability, not selection of a preferred unique explanation.

## 3. Research Methods | 研究方法

**中文** Wang使用TS、反射计、ECE、BES和DBS，并将实验剖面输入TGLF，分别跟踪密度变化和线性增长率/频率。[1, §§2–4] 本研究读取作者稿全文文本与全部图注，比较诊断半径、时间窗、波数与归一化，并分析连续性与谱通量表达式。未数字化Wang原图，未重跑实验拟合、TGLF或输运求解。

**EN** Wang uses TS, reflectometry, ECE, BES and DBS, with experimental profiles supplied to TGLF to compare density evolution against linear growth rates and frequencies.[1, §§2–4] FRA read the manuscript text and all captions, compared diagnostic radii, windows, wavenumbers and normalization, and analyzed continuity and spectral flux expressions. No Wang figure digitization, experimental refit, TGLF rerun or transport solution was performed.

**中文** C01–C17保留“原文报告的观察/模型结果”；OBS不意味着FRA复现，INTERPRETATION不意味着因果证明。CSV混合类别如OBS_AND_MODEL保留原样；本文叙述再区分其两部分。C22–C29为有条件分析或既有模型结果；C31为提案，C32为有限综合结论。

**EN** C01–C17 retain source-reported observations/model results: OBS does not mean FRA replication, and INTERPRETATION does not establish causality. Mixed CSV classes such as OBS_AND_MODEL are preserved, with their components distinguished in the prose. C22–C29 contain conditional analysis or prior model results; C31 is proposed work and C32 is bounded synthesis.

## 4. Main Findings | 主要发现

| Claims / 主张 | Source-reported result / 原文报告结果                                                                                                                                                                          | Locator and limit / 定位与限制                                                                                             |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| C01–C02       | ECH加至3.2 MW：2500 ms；3000 ms降至1 MW，NBI为3.2 MW；供气和NBI供粒保持恒定 / ECH rises to 3.2 MW at 2500 ms and falls to 1 MW at 3000 ms; NBI is 3.2 MW, with constant programmed gas/NBI fueling             | pp.3–4, Fig.1. Reduction is not switch-off; effective recycling sources are not fixed / 降功率不是关闭，有效再循环源未固定 |
| C03–C05       | 最快Te变化在ρ≈0.2–0.3，初始最强密度下降在ρ≈0.6–0.8 / Fastest Te change near 0.2–0.3; strongest initial density decrease near 0.6–0.8                                                                           | pp.4–6, Figs.2–4. Fifth-order fit error<15% is not a derivative error bound / 五阶拟合误差不等于导数误差界                 |
| C06, C08      | 外侧低k最大增长率先增加；TGLF主导频率在ρ≈0.5至少约80 ms、外侧约0.78超过150 ms后转向 / Outer low-k growth rises before frequency reversal, reported after at least about 80 ms at 0.5 and over 150 ms near 0.78 | pp.7–9, Figs.5–6. Linear classification, not measured nonlinear flux dominance / 线性分类，不是实测非线性通量主导          |
| C09–C11       | 外侧DBS迅速增强，内侧BES/DBS先降或较迟增强 / Outer DBS rises promptly; inner BES/DBS initially decrease or rise later                                                                                          | pp.7–9, Figs.5–7. BES≈0.1–0.3 and DBS≈1.6/2.1 in kθρs; no outer BES / 波数不匹配，外侧无BES                                |
| C07, C12–C14  | 外侧Ti梯度减弱且计算增长率上升，η_i报告下降约2–4倍 / Outer Ti gradients weaken while computed growth rises; reported η_i falls by about 2–4                                                                    | pp.9–10, Figs.8–9. Coupled background change, not a controlled ion-gradient intervention / 背景耦合，不是离子梯度独立控制  |
| C15–C17       | 降功率后密度回升；核心可先转回ITG而外侧仍TEM，台基TS/反射计存在差别 / Density recovers after power reduction; the core can reverse first while the edge remains TEM, with pedestal diagnostic discrepancies    | pp.10–12, Figs.10–13. Source/boundary budget and equilibrium mapping remain incomplete / 源、边界及映射预算未闭合          |
| C18–C21       | Fable显示正负谱贡献抵消；AUG加热响应依条件而异 / Fable shows cancellation of signed spectral contributions; AUG heating response depends on conditions                                                         | [2] Fig.2; [3] Figs.1–2; [4] abstract only / [4]仅摘要                                                                     |
| C32           | 转换不是受支持的必要启动条件；H1/H2仍不可唯一分离 / Conversion is not a supported necessary onset condition; H1/H2 remain nonunique                                                                            | Bounded FRA synthesis / 有边界综合，INCONCLUSIVE                                                                           |

**中文｜作者解释。** Wang将早期过程归因于外侧驱动增强，后期模态变化可进一步影响输运；论文还联系离子温度台基与热输运。[1, pp.9–14] 时空关联和TGLF支持该解释，但没有单独测得电势谱或有符号核，不能把它升级为“已分离的纯振幅机制”。

**EN | Authors' interpretation.** Wang attributes onset to increased outer turbulence drive, with later mode changes potentially modifying transport further, and relates this to the ion-temperature pedestal and ion heat transport.[1, pp.9–14] Spatial/temporal association and TGLF support the interpretation, but neither the potential spectrum nor signed response kernel was measured separately. It is not an isolated amplitude-only mechanism.

**中文** 原图仍待核查：图5文本提取存在疑似0.73/0.78径向标签差异，图9的η比值文字存在歧义；不从乱码轴标推数值。约80 ms处温度拟合的二次抬升被作者说明为伪影。第二个ECH周期有MHD锁模，不作为等条件重复。

**EN** Images remain pending: extracted Fig.5 labels have a possible 0.73/0.78 ambiguity and Fig.9 has ambiguous ratio transcription. No values are inferred from garbled axes. The author identifies a fitted temperature rise around 80 ms as an artifact. A locked MHD mode affects the second ECH cycle, which is not an equivalent repeat.

## 5. Review Approach | FRA 评议方法

### Continuity / 连续性（C22–C23）

**中文** 在固定几何、向外长度坐标r及轴上正则条件下，V'=dV/dr，
Γ表示与该坐标一致的总粒子通量：

**EN** For fixed geometry, an outward length coordinate r and an axis regularity condition, V'=dV/dr and Γ is the total flux consistent with that coordinate:

$$
\partial_t n+\frac{1}{V'}\partial_r(V'\Gamma)=S,\qquad
V'\Gamma(r)=\int_0^r V'(S-\partial_t n)\,dr.
$$

**中文** 局域密度下降只约束散度减源，不能确定该面通量符号或其增量。整体剖面n=a(t)n0(r)下降仍可使gn=−R∂r ln n不变。归一化磁通坐标需要相应度量；移动几何需要守恒形式，不可直接沿用固定长度坐标通量单位。

**EN** A local density decrease constrains divergence minus source, not the sign or increment of a single-surface flux. Uniform profile scaling n=a(t)n0(r) can reduce density without changing gn=−R∂r ln n. A normalized flux coordinate requires its metric; moving geometry requires a conservative expression rather than unchanged length-coordinate flux units.

### Signed spectrum / 有符号谱（C24–C27）

**中文** 在局域静电E×B通道，取B>0、k_y>0、exp[i(k_yy−ωt)]，实场谐波对计一次；δn_k=nR_kφ_k：

**EN** In the local electrostatic E×B channel, use B>0, k_y>0 and exp[i(k_yy−ωt)], counting each real-field harmonic pair once, with δn_k=nR_kφ_k:

$$
\Gamma^{ES}=n\sum_k I_kK_k,\quad I_k=|\phi_k|^2,\quad
K_k=-\frac{k_y}{2B}\operatorname{Im}R_k,
$$

$$
\delta\Gamma^{ES}=\frac{\Gamma_0^{ES}}{n_0}\delta n+
n_0\sum_k K_{k0}\delta I_k+n_0\sum_k I_{k0}\delta K_k+O(\delta^2).
$$

**中文** I采用有量纲电势功率；温度归一化留在K。保持共同物理k和谱标号；本征支出现/消失时不强行求逐支导数。统计表达使用复交叉谱定义相关响应R=S_nφ/(nS_φφ)，与φ不相关的密度残差不贡献该通量。

**EN** I is dimensional potential power, with temperature normalization retained in K. Use common physical k and spectral labels; do not force branch derivatives through branch creation/loss. Statistically define the correlated response by R=S_nφ/(nS_φφ); density residuals uncorrelated with φ contribute no such flux.

**中文** 若K和背景不变、所有I共同乘正数λ，Γ同乘λ；源自由且每个半径零通量的抵消不被打破。但有限源/非零通量背景或相对谱重排仍允许H1；核平滑改变也不需要主导ω过零。向内项减弱足以增加净向外输运，无需某项反向。

**EN** At fixed K and background, common multiplication of I by positive λ scales Γ by λ and preserves source-free zero-flux cancellation everywhere. H1 remains viable with finite sources/nonzero flux or relative reweighting. Smooth kernel changes need no dominant-frequency zero crossing. Reduced inward transport can increase net outward transport without a channel reversing sign.

**中文** 密度自谱P_nn=n²|R|²P_φφ，即使在理想相干单模极限也不能单独恢复I或ImR。设C_nφ=c√(P_nnP_φφ)exp(iθ)，固定P_nn、c时，P_φφ=1、sinθ=1/2与P_φφ=4、sinθ=1/4产生相同通量。因此即使增加一个总通量数值，也不唯一分离谱与核。

**EN** Density power P_nn=n²|R|²P_φφ identifies neither I nor ImR even in an ideal coherent single-mode limit. With C_nφ=c√(P_nnP_φφ)exp(iθ), fixed P_nn and c allow the same flux for P_φφ=1, sinθ=1/2 or P_φφ=4, sinθ=1/4. An additional total-flux value still does not uniquely separate spectral weights and kernels.

## 6. Scientific Contribution & Novelty | 科学贡献与先进性

**中文** Wang提供的时序区别于只比较稳态前后的解释。[1] 本文新增的是对推断边界的明确化：排除一个带延迟的必要条件，不等于在两个可同时响应的微观项之间完成反演。Fable的指定核心模型图2给出低k TEM向外、ITG与短波电子支向内的抵消示例；模态名称不决定粒子通量符号。[2] 不对尚未系统研读的全部前序文献作优先权评价。

**EN** Wang's time ordering goes beyond initial/final stationary comparisons.[1] FRA clarifies the inference boundary: excluding a delayed necessary event does not invert two microscopic terms that can respond simultaneously. Fable's specified core model shows outward low-k TEM and inward ITG/short-wave electron-branch contributions cancelling in Fig.2; a mode name does not determine particle flux sign.[2] Priority over the wider unreviewed literature is not assessed.

**中文｜FRA-04B1（C28–C29）。** 截至2026-10-27，[PR #16](https://github.com/ZWY-research/Fusion-Research-Atlas/pull/16)为OPEN、未合并。本记录从main独立建立，不包含其提交；引用[固定提交的模型报告](https://github.com/ZWY-research/Fusion-Research-Atlas/blob/33bf206d5557d4a7b23d52eb9c31dbf449471226/docs/literature/comparisons/fra-04b1-electron-kinetic-flux.md)而不依赖main不存在的文件。其既有81点模型扫描显示固定模态S_e变号、F_e始终负；零点约0.83286795不是通量零点，无DIII-D标定。本轮未重跑。小δge会限制直接S_eδge项，不能仅凭导数大就宣称领先机制。

**EN | FRA-04B1 (C28–C29).** As of 27 October 2026, [PR #16](https://github.com/ZWY-research/Fusion-Research-Atlas/pull/16) is OPEN and unmerged. This note starts independently from main and contains none of its commits; it references the [commit-pinned model note](https://github.com/ZWY-research/Fusion-Research-Atlas/blob/33bf206d5557d4a7b23d52eb9c31dbf449471226/docs/literature/comparisons/fra-04b1-electron-kinetic-flux.md), not a missing main-branch file. Its existing 81-point scan has a sign-changing fixed-mode S_e while F_e remains negative. The approximate 0.83286795 response zero is not a flux zero and has no DIII-D calibration. It was not rerun here. A small actual δge limits S_eδge regardless of derivative magnitude.

## 7. Limitations & Open Questions | 局限性与开放问题

| Candidate / 候选                  | Explains / 可解释                                                           | Tension / 张力                                                                                                | Distinguishing prediction and missing data / 判别预测与缺失                                                                                  |
| --------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| H1 intensity/weights / 振幅与权重 | Prompt outer response without conversion / 不转换也可早期外侧响应           | Density power is not potential power; zero-flux common scaling fails / 密度功率非电势功率，零通量共同放大无效 | Fixed K plus measured I should recover signed change; need potential and signed channel spectra / 固定K更新I应恢复响应，需电势及有符号通量谱 |
| H2 response kernel / 响应核       | Phase/magnitude/resonance can change within ITG / ITG内相位、幅度、共振可变 | No measured kernel; local ge changes may be small / 无实测核，局部ge变化可能小                                | Fixed I plus updated K should recover response; need complex cross spectra and response tests / 固定I更新K检验，需复交叉谱及响应计算         |
| H3 sources/boundaries / 源与边界  | Outer storage loss and delayed core evolution / 外侧库存变化及核心迟后演化  | Programmed sources fixed; pedestal diagnostics differ / 程序源固定，台基诊断不同                              | Close source–inventory balance; need effective sources, geometry and boundary flux / 闭合源—库存预算，需有效源、几何和边界通量               |

**中文** 三者可共存。TGLF最不稳定支不等于非线性谱能量或粒子通量主导支；无同带宽电势谱与复交叉谱，H1/H2贡献比例仍未知。对源、边界和背景不确定性的额外限制也不能补出不存在的相位数据。

**EN** The candidates may coexist. The fastest-growing linear branch need not dominate nonlinear spectral energy or particle flux. Without matched potential and complex cross spectra, H1/H2 shares remain unknown. Better source, boundary or background constraints do not supply missing phase information.

## 8. Contribution to Fusion Research | 对聚变研究的具体推进

**中文** 直接贡献是将密度泵出时序转化为有适用条件的机制约束，明确下一次观测应测什么；潜在用途是改善电子加热下的粒子输运预测。装置预测、控制收益及对未来反应堆的外推均未验证。

**EN** The direct contribution is a conditional mechanism constraint from pump-out timing and a specification of missing observables. Improved particle-transport prediction under electron heating is a potential use; device prediction, control benefits and reactor extrapolation are unverified.

## 9. Cross-disciplinary Research Opportunities | 跨学科研究机会

**中文** 具体反问题是从P_nn、源与密度储存估计I和K。即使理想测量无噪声，§5的退化例子仍说明观测映射不单射。实验设计应增加同位置、同物理k和时间窗的S_φφ与复S_nφ（或等价的n—v_E交叉谱及速度自谱），并量化校准、相干度和谱外贡献；只提高dn/dt精度不能修复这一结构性缺口。

**EN** The inverse problem is to infer I and K from density power, sources and storage. The counterexample in §5 shows a noninjective observation map even without noise. Experimental design should add colocated, matched-k/time potential power and complex density–potential cross spectra, or equivalent density–E×B-velocity cross and velocity autospectra, with calibration, coherence and out-of-band uncertainties. More precise dn/dt alone cannot repair this structural deficit.

## 10. Next Verification | 下一步研究验证

| Task / 任务                               | Inputs and method / 输入与方法                                                                                                                                           | Discriminator and status / 判别与状态                                                                                                 |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Source–inventory balance / 源—库存连续性  | Verified n(r,t), geometry, effective S and boundary conditions; distinguish storage contribution from source contribution / 核实密度、几何、有效源和边界，分离储存与源项 | Constrains total loss, not microscopic partition; proposed / 约束总损失，不能独自分离微观项；提议                                     |
| C31 crossed reconstruction / 交叉冻结重构 | Two confirmed times and radii, common k grid and units; J_ab=ΣI^(a)K^(b) / 两时片两半径，统一波数单位                                                                    | ΔJ=(J10−J00)+(J01−J00)+(J11−J10−J01+J00); proposed, no device solver runs / 仅提议，未运行装置求解                                    |
| Fixed-mode response / 固定模态响应        | Passive electrons at confirmed eigenfields, respecting the actual bulk constraints / 确认本征场上的被动电子，遵守真实主组分约束                                          | Compare direct gradient response with coupled modal/spectral response; proposed / 比较直接梯度与耦合响应；提议                        |
| Matched cross spectra / 同带宽交叉谱      | Outer response region before delayed conversion, with potential/velocity power and complex cross spectra / 外侧早期窗口内电势或速度自谱与复交叉谱                        | Identifies measured-band weight/kernel changes, not automatically total pump-out; proposed / 区分该带宽内贡献，不自动代表全通量；提议 |

**中文** 交叉组合是代数诊断，不是四个自洽实验态。输入未确认前不模拟；若贡献排序对误差或饱和规则不稳，继续保留INCONCLUSIVE。本公开记录不启动后续节点。

**EN** Crossed combinations are diagnostic reconstructions, not four self-consistent experimental states. Do not simulate with unconfirmed inputs; retain INCONCLUSIVE if ordering is not robust to uncertainty or saturation rules. This public record initiates no follow-on node.

## 11. Study Status & References | 研读状态与参考资料

| Material / 材料        | Actual scope / 实际范围                                                                                                              | Verification limit / 核查边界                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| Wang 2017 [1]          | NF-101849.R1, 16-page text, §§1–6, all Fig.1–14 captions / 16页全文及全部图注                                                        | Original PDF images and digitization pending; not independently reproduced / 原图及数字化待完成，未独立复现 |
| Fable 2010 [2]         | EPFL 26-page manuscript; targeted §§2–3.4,3.8,4; visual p.7 Eqs.16–17, p.20 Fig.1, p.21 Fig.2, p.26 Fig.7 / 定向正文、关键方程及原图 | No GS2/GYRO reproduction; not every figure independently assessed / 未复现求解，未逐图完整评议              |
| Mlynek 2012 [3]        | MPG 12-page manuscript; targeted §§I–III and §IV nonuniqueness paragraph; visual p.3 Figs.1–2 / 定向正文和两幅原图                   | No ASTRA reproduction or loop digitization / 未复现ASTRA或数字化回线                                        |
| Angioni 2011 [4]       | MPG manuscript p.1 abstract visually read / 仅视觉阅读摘要                                                                           | Full text and decomposition figures not checked / 全文与分项图未核验                                        |
| Mathematics / 数学     | Conditional derivations and previously executed algebra checks in FRA-04B2 / 既有条件推导和代数核对                                  | Mathematical consistency is not independent physical verification / 数学一致性不是独立物理验证              |
| Publication / 发布整理 | Research date 2026-10-26; curation 2026-10-27 / 研究与整理日期分列                                                                   | 32 local claims preserved; no graph/status/count promotion / 保留32项局部主张，不提升图谱、状态或统计       |

**中文** 本页与CSV是公开科学记录，不含原文PDF/图像、本机路径或私有装置资料。CSV的“Report section”定位保留原始FRA-04B2报告内部编号；本文§§4–7按C编号提供对应公开解释。C30只记录研究者提供的历史认识，不将私人会话作为实验独立证据。文献计数仍为5 / 5 / 0；本专题不是新增完成论文评议。Wang期刊稿未由会议稿或博士论文替代。

**EN** This page and CSV contain no source PDF/images, machine-specific paths or private device material. CSV “Report section” locators retain original FRA-04B2 internal numbering; §§4–7 provide public explanations keyed by C identifiers. C30 records researcher-supplied prior understanding, not independent experimental evidence from a private conversation. Counts remain 5 / 5 / 0; this topic is not an additional completed paper study. Neither conference material nor a dissertation substitutes for Wang's journal manuscript.

1. Wang, X. et al. Understanding ECH density pump-out in DIII-D H-mode plasmas. _Nucl. Fusion_ **57**, 116046 (2017). [DOI](https://doi.org/10.1088/1741-4326/aa7f99); [OSTI manuscript](https://www.osti.gov/servlets/purl/1374571). Actual scope / 实际范围：text and captions only; image audit pending / 全文文本及图注，原图待核查。
2. Fable, E., Angioni, C. & Sauter, O. The role of ion and electron electrostatic turbulence in characterizing stationary particle transport in the core of tokamak plasmas. _Plasma Phys. Control. Fusion_ **52**, 015007 (2010). [DOI](https://doi.org/10.1088/0741-3335/52/1/015007); [EPFL manuscript](https://infoscience.epfl.ch/server/api/core/bitstreams/8ea1f8f7-6547-4936-9208-85da5acd2bd6/content). Scope / 范围：targeted text and selected equations/figures as above / 上述定向正文与方程图像。
3. Mlynek, A. et al. Temporally resolved analysis of the response of density and temperature to modulated central electron heating on ASDEX Upgrade. _Nucl. Fusion_ **52**, 114012 (2012). [DOI](https://doi.org/10.1088/0029-5515/52/11/114012); [MPG manuscript](https://pure.mpg.de/rest/items/item_2145816_4/component/file_2145815/content). Scope / 范围：selected text, Figs.1–2 and model nonuniqueness on PDF p.11 / 定向正文、两图及p.11模型非唯一性。
4. Angioni, C. et al. Gyrokinetic modelling of electron and boron density profiles of H-mode plasmas in ASDEX Upgrade. _Nucl. Fusion_ **51**, 023006 (2011). [DOI](https://doi.org/10.1088/0029-5515/51/2/023006). Scope / 范围：abstract only / 仅摘要。
