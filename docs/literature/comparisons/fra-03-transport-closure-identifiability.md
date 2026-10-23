# FRA-03 — Particle-transport closure identifiability and perturbative verification

# FRA-03——粒子输运闭合的可辨识性与扰动验证

[Literature catalogue / 文献目录](../README.md) · [FRA-02 comparison / 跨研究比较](q-density-cross-study-comparison.md) · [Calculation script / 计算脚本](../../../scripts/research/fra03_transport_closure.py) · [Numerical results / 数值结果](fra-03/results.json)

## 1. Scope and provenance / 研究范围与来源版本

**EN** This is a mathematical/computational research note for `q-density`, based on main `d4d34b9dc0a37cf2f8e545b573401e947907bed3` (23 October 2026). It implements the supplied FRA-03 mathematical route and dimensionless inputs. The proofs are elementary constructions and Taylor/linear-algebra arguments illustrating known inverse-problem principles; no new theorem or priority claim is made. The calculations verify prescribed examples, not experimental transport coefficients, a turbulence mechanism or an original paper's simulation. Document-local A–C and C1–C3 labels are not graph source/finding IDs.

**中文** 本文是针对 `q-density` 的数学与计算研究记录，基于上述 main 版本，执行指定的 FRA-03 数学路线及无量纲输入。证明属于构造、Taylor 展开和线性代数，用于展示已知反问题原理，不宣称新定理或优先权。计算核验人为指定的算例，不是实验输运系数反演、湍流机制验证或原论文模拟复现。A–C、C1–C3 仅为本文局部编号，不是图谱来源或 finding ID。

**EN** Scientific inputs inherited from FRA-02 are [FRA02-C03 and C04](q-density-cross-study-comparison.md#3-cross-study-findings-what-is-and-is-not-comparable--跨研究的实质判断), plus the existing [Angioni 2003](../papers/angioni-2003.md), [Mordijck 2020](../papers/mordijck-2020.md) and [Angioni 2012](../papers/angioni-2012-off-diagonal-transport.md) reviews. These repository reviews were consulted; their underlying PDFs, original measurements and executable model inputs were not reread or reproduced here. Existing graph data, epistemic/verification states and the 5/5/0 literature counts are unchanged.

**中文** 继承 FRA02-C03、C04 及上述三篇已有评议。本轮查阅的是仓库评议，没有重新阅读其原始 PDF、取得原始测量或复算原模型。图谱数据、认识及核验状态、5/5/0 文献统计均不改变。

## 2. Method references and actual reading / 方法文献及实际核查范围

**EN** The following are method references within this note, not three newly completed FRA literature studies. Crossref records were retrieved for all three DOIs. Reading scope and claim locators are deliberately narrower than whole-paper verification.

**中文** 下列为本文方法参考，不计作新增三篇已完成 FRA 研读。三个 DOI 均取得 Crossref 书目记录；实际阅读范围和主张定位不等于整篇核验。

| Reference / 参考文献           | Actual access and locator / 实际访问及定位                                                                                                                                                                                                                                              | Relevant reported capability and limit / 原文报告能力与限制                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [1] Karalashvili et al. (2011) | Crossref publisher-deposited **abstract and metadata only**; no full text / 仅元数据及出版方存入 Crossref 的摘要，未读全文                                                                                                                                                              | The abstract describes identifying state-dependent diffusion-model structure/parameters with **known convective velocity**, correcting incremental-identification error, and a transient 3D film-flow numerical example. It does not establish simultaneous arbitrary D/V identification from one steady density profile. / 摘要报告已知对流速度时识别状态依赖扩散模型及修正误差，并有三维非稳态液膜算例；不证明从单一稳态密度唯一识别任意 D/V。                                                                                   |
| [2] van Kampen et al. (2023)   | Publisher HTML: Abstract, Introduction and Methodology through Eqs. (1)–(10); metadata also checked. Targeted text reading, no systematic full-article/figure review or code replication / 定向阅读出版方 HTML 摘要、引言及方法式（1）—（10）；另核对书目，未系统研读全文图表或复现代码 | Reports finite-basis linear regression of transport coefficients and a spatial source profile with a **known temporal modulation signal**, using multiple frequencies. Eq. (1) declares the linearized transport model; Eqs. (7)–(10) formulate regression. Source estimation is possible within such structure; it does not remove rank, derivative, basis or noise limitations for unrestricted closures. / 在已知时间调制、有限基函数及线性化模型下报告输运系数与空间源联合回归；并非消除一般闭合的秩、导数、基函数及噪声限制。 |
| [3] Gentle et al. (1992)       | **Metadata only** from Crossref; publisher abstract request returned HTTP 403. Abstract/full text not inspected / 仅 Crossref 书目；出版方摘要入口返回 403，未读摘要或全文                                                                                                              | The verified title concerns equilibrium/perturbed fluxes and turbulence in a tokamak. No experimental result, diagnostic capability or equation is attributed to this paper here. / 题名涉及托卡马克平衡与扰动通量及湍流；本轮不据题名推断实验结果、诊断能力或公式。                                                                                                                                                                                                                                                               |

**EN** The already reviewed Mordijck record provides the source-specific example of density modulation and the distinction between perturbative and reconstructed steady coefficients: accepted-manuscript pp. 9–14, Eqs. (1)–(10), and pp. 20–21; existing `finding-m20-modulation`, `finding-m20-tangent-steady`, `finding-m20-source-ratio`. Angioni 2003's model incremental derivatives are at journal p. 205003-3, Eqs. (1a),(1b), Fig. 3 (`finding-a03-incremental-flux`); the 2012 review's state-dependent decomposition is at §§2–3, Eqs. (1),(2),(5) (`finding-a12-flux-decomposition`). Those are inherited source locators, not new checks of the originals.

**中文** Mordijck 既有评议中，接受稿第 9–14、20–21 页及式（1）—（10）提供密度调制、扰动与重建稳态系数区别的来源例子，对应上述三个既有 finding。Angioni 2003 的增量导数定位为期刊 205003-3 页、式（1a）、（1b）、图 3；2012 综述的状态依赖分解定位为第 2–3 节、式（1）、（2）、（5）。这些是沿用的原文定位，不代表本轮重查原件。

1. Karalashvili, M., Groß, S., Marquardt, W., Mhamdi, A. & Reusken, A. Identification of Transport Coefficient Models in Convection-Diffusion Equations. _SIAM J. Sci. Comput._ **33**, 303–327 (2011). [doi:10.1137/09077360X](https://doi.org/10.1137/09077360X). [Metadata/abstract record / 书目及摘要记录](https://api.crossref.org/works/10.1137/09077360X).
2. van Kampen, R., de Vries, J., Weiland, S., de Baar, M. & van Berkel, M. Fast simultaneous estimation of nD transport coefficients and source function in perturbation experiments. _Sci. Rep._ **13**, 3241 (2023). [doi:10.1038/s41598-023-30337-0](https://doi.org/10.1038/s41598-023-30337-0). [Publisher HTML / 出版方正文](https://www.nature.com/articles/s41598-023-30337-0).
3. Gentle, K. W. et al. Equilibrium and perturbed fluxes and turbulence levels in a tokamak: Implications for models. _Phys. Rev. Lett._ **68**, 2444–2447 (1992). [doi:10.1103/PhysRevLett.68.2444](https://doi.org/10.1103/PhysRevLett.68.2444). [Metadata record / 书目记录](https://api.crossref.org/works/10.1103/PhysRevLett.68.2444).

## 3. Questions, governing equation and assumptions / 科学问题、控制方程与假设

**EN** Q1 asks why a single steady state generally cannot separate D and V. Q2 asks what independent information perturbations add and when it is identifiable. Q3 asks whether matching the steady state and first response fixes finite-amplitude behavior. All three questions concern the declared model class, not unrestricted identifiability of real plasma physics.

**中文** Q1：单一稳态为何一般不能分离 D、V？Q2：扰动增加哪些独立信息，在什么条件下可辨识？Q3：稳态及一阶响应相同是否足以确定有限幅度行为？讨论均限于明示模型类，不宣称解决真实等离子体全部物理的辨识。

On a fixed interval I=[a,b], with outward-positive flux / 固定区间上通量向外为正：

$$
\partial_t n+A^{-1}\partial_r(A\Gamma)=S,\qquad
\Gamma=F(n,p;r),\quad p=\partial_r n.
$$

**EN** For A and the integrated balance take A∈C¹(I), A>0, known sources and specified inner flux. For the steady construction use n₀∈C²(I), n₀≥n_min>0 and Γ_req∈C¹(I), consistent with ∂r(AΓ_req)=AS₀. A physical axis where A=0 needs a separate regular limit; it is not covered by division by A here. F is local and instantaneous with fixed r, geometry and other state variables. Taylor differentiation requires C¹ in (n,p); a bounded C² Hessian on a neighborhood yields an O(ε²) flux remainder. Uniformly positive −F_p is an additional parabolicity condition for the forward PDE, not a consequence of the steady identity alone.

**中文** 对积分守恒取 A 连续可微、严格正，源与内侧通量已知。稳态构造要求 n₀ 二阶连续可微且有正下界，Γ_req 连续可微并满足稳态守恒。A=0 的磁轴须另取正则极限，不能直接相除。F 为固定几何及其他状态下的局域、无记忆闭合；关于 n、p 连续可微即可作一阶变化，邻域内有界二阶导数可给出 O(ε²) 通量余项。正的 −F_p 是正向抛物型问题的额外条件，不由稳态恒等式自动保证。

**EN** Where the tangent flux is differentiated spatially as a classical PDE, take F to be C² jointly in (n,p,r), and the perturbation η∈C²(I). This supplies the additional radial regularity; the pointwise flux variation itself needs only C¹ in (n,p).

**中文** 将切线通量继续作空间求导、写成经典 PDE 时，另取 F 关于 (n,p,r) 联合 C²、η∈C²(I)，保证所需径向正则性；单点通量一阶变化本身只需关于 (n,p) 的 C¹ 条件。

## 4. A: steady nonuniqueness and C1 / 稳态非唯一性证明及算例 C1

For every admissible D∈C¹(I) with D≥d_min>0, define / 对任意容许的正扩散函数定义：

$$
V_D(r)=\frac{\Gamma_{\rm req}(r)+D(r)n_0'(r)}{n_0(r)}.
$$

**Proof / 证明.** The positive denominator and stated regularity give V_D∈C¹(I). Direct substitution gives

**中文** 分母有正下界，结合所列正则性可知 V_D∈C¹(I)；直接代入得到下式。

$$
-D n_0'+V_D n_0=-D n_0'+\Gamma_{\rm req}+D n_0'=\Gamma_{\rm req}.
$$

**EN** Thus every such D produces the same n₀, flux and source balance. Distinct D give distinct V wherever n₀′≠0; at a flat point V=Γ_req/n₀ is fixed but D is still unconstrained by this equation. There is no required positive sign for V. This is a nonuniqueness result for freely varying coefficient functions under the same density/flux boundary data. Independent V measurements, a restricted parametric family or other physical constraints can reduce that family; uniqueness is not excluded for every restricted inverse problem.

**中文** 因此任意这样的 D 都恢复同一 n₀、通量和源平衡。n₀′ 非零处，不同 D 给出不同 V；平坦点的 V 已固定，但 D 仍不由该式确定。V 无须为正。结论适用于系数函数可自由变化且密度／通量边界数据相同的模型类；独立 V 测量、受限参数族或其他物理约束可以缩小该族，不是否认所有受限反问题的唯一性。

**C1 inputs / 输入：** r∈[0,1], A=1, S₀=Γ_req=0, n₀=1+0.2cos(πr), n₀′=−0.2πsin(πr), D₁=0.5, D₂=1.2. The exact derivative is used, without a profile fit / 使用解析导数，不作剖面拟合。

| D   | V(0.5)              | Sampled min V / 采样最小值 | max abs(−Dn₀′+Vn₀) |
| --- | ------------------- | -------------------------- | ------------------ |
| 0.5 | −0.3141592653589793 | −0.3206332728565118        | 5.55×10⁻¹⁷         |
| 1.2 | −0.7539822368615503 | −0.7695198548556283        | 1.11×10⁻¹⁶         |

**EN** n₀ ranges from 0.8 to 1.2. The [129-point profiles and residuals](fra-03/c1-profiles.csv) show two different effective convection profiles with indistinguishable prescribed zero flux. This is a constructed mathematical model, not an experimental inversion.

**中文** n₀ 在 0.8–1.2 之间；129 点 CSV 保存两套不同的有效对流剖面与通量残差。这里的零通量相同是人为构造结果，不是实验反演。

## 5. B: tangent closure, rank and C2 / 切线闭合、秩条件与算例 C2

Set n=n₀+εη and p=p₀+εη′, holding r fixed. Taylor's formula gives / 固定 r 展开：

$$
F(n_0+\varepsilon\eta,p_0+\varepsilon\eta';r)
=F(n_0,p_0;r)+\varepsilon(F_n\eta+F_p\eta')+O(\varepsilon^2).
$$

Therefore, with derivatives evaluated at the background / 导数均在背景状态取值：

$$
D_{\rm tan}=-\partial_p F,\quad V_{\rm tan}=\partial_n F,
\qquad \delta\Gamma=-D_{\rm tan}\partial_r\delta n+V_{\rm tan}\delta n.
$$

**EN** With only C¹ smoothness, replace the O(ε²) remainder by o(ε). If F=−D(n,p;r)p+nV(n,p;r), the chain rule gives D_tan=D+pD_p−nV_p and V_tan=V+nV_n−pD_n. These generally differ from the coefficients named D,V in the flux decomposition. V_tan is a differential density response, not automatically a separately measured microscopic pinch. Other evolving variables z add F_zδz, outside the two-parameter inversion.

**中文** 仅有 C¹ 光滑性时余项为 o(ε)。将状态依赖的 −Dp+nV 作完整链式求导，得到上述切线系数，一般不等于分解中名为 D、V 的系数；V_tan 也不自动等于独立测得的微观箍缩。若其他状态 z 改变，还须加入 F_zδz，不能强行归入两参数反演。

At one radius, independent prescribed responses give / 单点两组响应构成：

$$
\begin{pmatrix}-\delta n_1'&\delta n_1\\-\delta n_2'&\delta n_2\end{pmatrix}
\begin{pmatrix}D_{\rm tan}\\V_{\rm tan}\end{pmatrix}
=\begin{pmatrix}\delta\Gamma_1\\\delta\Gamma_2\end{pmatrix},
\qquad \det M=\delta n_1\delta n_2'-\delta n_2\delta n_1'\ne0.
$$

**EN** This determinant is the full-rank condition for the noise-free two-unknown problem. More responses require column rank 2 after consistent scaling/weighting. A small smallest singular value amplifies errors; noisy gradients also perturb M, making this an errors-in-variables problem. A condition number depends on coordinate/column scaling and is not a universal experimental uncertainty.

**中文** 行列式非零是无噪声两未知数问题的满秩条件；更多响应须在一致尺度与权重下保持列秩 2。最小奇异值很小时误差放大；梯度误差还改变 M 本身。条件数依赖坐标和列尺度，不能当作普适实验误差条。

**Harmonic condition / 谐波条件.** For real, frequency-independent tangent coefficients and ñ=Re[N(r)e^{iωt}], N=a(r)e^{iφ(r)}, stacking real/imaginary parts gives

$$
M_\omega=\begin{pmatrix}-\Re N'&\Re N\\-\Im N'&\Im N\end{pmatrix},
\qquad \det M_\omega=\Im(N'\overline N)=a^2\phi'.
$$

**EN** Thus nonzero amplitude and phase gradient provide independent quadratures under these assumptions. The e^{−iφ} convention reverses the determinant's sign, not its rank. Zero phase slope loses rank; near zero it is poorly conditioned. Complex frequency-dependent closures introduce additional unknowns. Moreover, flux must be measured or obtained from the known harmonic source and inner boundary flux:

**中文** 在这些假设下，非零幅值和相位梯度可提供独立约束；改用 e^{−iφ} 约定只改变符号。相位梯度为零则退化，接近零时病态。若闭合有复数频率响应，未知数更多。通量还须直接测量或由已知谐波源及内侧通量得到：

$$
A(r)\widehat\Gamma(r)=A(a)\widehat\Gamma(a)+
\int_a^r A(s)[\widehat S(s)-i\omega N(s)]\,ds.
$$

**EN** An arbitrary unknown source or boundary flux cannot simply be set to zero. A structured joint estimator such as reference [2] can instead add source parameters and independent frequencies, provided its enlarged design matrix is identifiable. This is distinct from claiming that source uncertainty always makes estimation impossible.

**中文** 任意未知的源或边界通量不能默认为零。参考 [2] 一类结构化联合估计可增加源参数及独立频率，但扩大后的设计矩阵仍须可辨识；不能反过来宣称源未知就一律无法估计。

**C2 / 算例：** At r=0.5, prescribed δn₁=sin(πr), δn₂=sin(2πr) have (δn₁,δn₁′)=(1,0), (δn₂,δn₂′)=(0,−2π). With D_tan=0.7, V_tan=−0.3:

$$
M=\begin{pmatrix}0&1\\2\pi&0\end{pmatrix},\quad
b=\begin{pmatrix}-0.3\\1.4\pi\end{pmatrix},\quad
M^{-1}=\begin{pmatrix}0&(2\pi)^{-1}\\1&0\end{pmatrix}.
$$

**EN** Rank=2, unscaled κ₂=2π≈6.28318530718; recovered (0.7,−0.3), coefficient and response residuals both zero in this calculation. Replacing δn₂ by 2δn₁ gives M=[[0,1],[0,2]], rank=1, κ₂=∞, b=(−0.3,−0.6). Both (D,V)=(0.7,−0.3) and (1.2,−0.3) fit exactly. JSON represents the infinite condition number by null with an explicit explanatory field. C2 generates the flux algebraically; it does not solve a forced PDE or estimate noisy measured fluxes.

**中文** 满秩算例恢复指定系数，计算残差为零；比例扰动时秩为 1，条件数无穷，两套正 D 均精确符合相同响应，不能唯一恢复两个系数。JSON 用带说明的 null 表示无穷。这里通量由代数公式生成，没有求解受迫 PDE，也没有反演有噪声的实测通量。

## 6. C: nonlinear closures sharing a steady state and tangent / 同稳态、同切线的二阶竞争闭合

For F₀∈C² in (n,p), λ∈C¹(I), and the same n₀, define / 对同一背景定义：

$$
F_\lambda(n,p;r)=F_0(n,p;r)+\lambda(r)[n-n_0(r)]^2.
$$

**Proof / 证明.** At (n₀,n₀′), the added flux and its n,p derivatives vanish. Hence the steady flux and the first-variation operator, including its spatial divergence, coincide. At fixed r,

**中文** 在 (n₀,n₀′) 处，附加通量及其关于 n、p 的一阶导数均为零，所以稳态通量与一阶变化算子及其空间散度相同。固定 r 时有下列导数关系。

$$
(F_\lambda)_n=(F_0)_n+2\lambda(n-n_0),\quad
(F_\lambda)_p=(F_0)_p,\quad
(F_\lambda)_{nn}=(F_0)_{nn}+2\lambda.
$$

**EN** The nn Hessian differs wherever λ≠0. For the same finite perturbation εη, the flux difference is exactly λε²η². The p derivative and thus parabolicity are unchanged by this addition; positive densities are retained in a sufficiently small neighborhood of n₀. This constructs indistinguishable steady/linear closures, not evidence that any λ describes a real plasma. Nonzero λ can be invisible to a perturbation that vanishes on its support; richer excitation is still necessary.

**中文** λ 非零处二阶导数不同；同一有限扰动的通量差恰为 λε²η²。该附加项不改变 p 导数及其抛物型条件，n₀ 的充分小邻域保持密度为正。构造说明稳态和线性响应仍可留下闭合自由度，不证明某个 λ 是真实等离子体闭合；扰动若在 λ 所在区域为零，依然无法判别。

## 7. C3 analytical prediction / C3 解析预测

**EN** Use exactly the prescribed dimensionless inputs: x∈[0,π], A=1, S=0, n₀=1, D=1, λ∈{0,+0.5,−0.5}, ε∈{0.025,0.05,0.1}, t*=0.2, n(0,t)=n(π,t)=1 and n(x,0)=1+εsin x. Then u=n−1 obeys

**中文** 严格使用上述无量纲区间、三组 λ、三组 ε、目标时刻及指定初边界条件，实际求解：

$$
u_t=Du_{xx}-\lambda\partial_x(u^2),\quad
u(0,t)=u(\pi,t)=0,\quad u(x,0)=\varepsilon\sin x.
$$

**EN** Here S=0 does not mean boundary flux is zero: fixed-density ends allow excess particles to leave. This differs from C1's prescribed zero steady flux.

**中文** S=0 不等于边界零通量；固定密度边界允许过量粒子流出，与 C1 指定的稳态零通量不同。

**Proof of the second-order prediction / 二阶预测推导.** Substitute u=εu₁+ε²u₂+O(ε³). With homogeneous Dirichlet data for both orders, u₁(x,0)=sin x and u₂(x,0)=0,

**中文** 将上述展开代入，按 ε 的幂次比较；两阶均满足齐次 Dirichlet 边界，初值分别为 sin x 与零，得到下式。

$$
(u_1)_t=D(u_1)_{xx},\quad u_1=e^{-Dt}\sin x,
\qquad
(u_2)_t=D(u_2)_{xx}-\lambda e^{-2Dt}\sin(2x).
$$

Writing u₂=b₂(t)sin(2x), the scalar equation b₂′+4Db₂=−λe^{−2Dt}, b₂(0)=0 gives / 由标量方程积分得：

$$
u_2=-\frac{\lambda}{2D}(e^{-2Dt}-e^{-4Dt})\sin(2x),\qquad
a_2=\frac2\pi\int_0^\pi u\sin(2x)\,dx
=\varepsilon^2 b_2(t)+O(\varepsilon^3).
$$

**EN** The expansion assumes a smooth solution family in ε for this uniformly parabolic problem over the finite time interval; it is not an exact finite-ε solution. Orthogonality removes the first sine mode from a₂. For λ=0.5, D=1, t=0.2, b₂=−0.05524777047960444, and ε=0.1 gives a₂^(2)=−0.0005524777047960446, consistent with the supplied rounded reference. For λ=0 the linear heat solution has exactly zero second harmonic in the continuum.

**中文** 此展开以有限时间内解对 ε 光滑依赖为条件，不是有限 ε 精确解；正交性排除第一谐波对 a₂ 的贡献。上述 b₂ 与指定二阶参考一致；λ=0 时连续线性热方程的第二谐波严格为零。

## 8. Actual numerical method and reproduction / 实际数值方法与复现

**EN** The [script](../../../scripts/research/fra03_transport_closure.py) uses installed Python 3.14.7 and NumPy 2.5.3, float64. SciPy 1.18.1 was available but not needed. No new dependencies were installed. Every physical/numerical input is in `PARAMETERS`; no coefficient fitting, random data, parameter tuning or external data is used. The explicit output directory keeps execution artifacts outside the repository. From the repository root, for example:

**中文** 使用现有 Python、NumPy 双精度环境，未使用已安装 SciPy，也未增加依赖。全部输入写在 `PARAMETERS`；不拟合、不调参、不用随机或外部数据。显式输出目录用于仓库外执行。可从仓库根目录运行，例如：

```text
python scripts/research/fra03_transport_closure.py --output-dir ../fra03-results
```

With N=64,128,256 intervals and h=π/N, use face flux and divergence / 空间离散为：

$$
F_{i+1/2}=-D\frac{u_{i+1}-u_i}{h}
+\frac{\lambda}{2}(u_{i+1}^2+u_i^2),\qquad
\dot u_i=D\frac{u_{i+1}-2u_i+u_{i-1}}{h^2}
-\lambda\frac{u_{i+1}^2-u_{i-1}^2}{2h}.
$$

**EN** Classical explicit RK4 advances all nine (λ,ε) cases. Every RK stage has zero boundary derivatives with zero boundary values, and endpoints are explicitly fixed again after updates. No periodic wrap is used. For c=0.2 and 0.1 choose m=ceil[t*/(ch²/D)], Δt=t*/m, reaching t* without interpolation. There are six grid/time settings and 54 harmonic-result rows. Projection uses the composite trapezoidal rule on all grid points, including the zero endpoints.

**中文** 经典显式 RK4 同时推进九组独立算例；所有中间阶段端点导数为零，更新后再次固定端点，没有周期边界。按上述两组 c 及向上取整步数精确到达 t*；共六组网格／步长设置、54 行谐波结果。投影使用包括零端点的复合梯形积分。

**EN** The diffusive number DΔt/h²≤0.2 gives a frozen diffusion eigenvalue bound |Δt μ|≤0.8, within RK4's negative-real stability interval. The largest measured advective CFL bound is 9.80×10⁻⁴ and cell Péclet bound 4.91×10⁻³. These small-step diagnostics and the observed bounded trajectories support stability for these runs; they are not a general nonlinear stability theorem. Sampling after each full step gave 0≤u≤0.1 and zero endpoint error. The λ=0 discrete sine eigenvalue 4Dsin²(h/2)/h² provides an independent exact semidiscrete time-evolution check, in addition to the continuum heat solution.

**中文** 扩散数不超过 0.2，对应扩散特征值乘步长的模不超过 0.8，位于 RK4 负实轴稳定区间内。最大对流 CFL、单元 Péclet 如上。小步长诊断与计算轨迹有界性支持这些算例的稳定性，不是任意非线性问题的稳定定理。整步采样中 u 始终在 0–0.1 内、边界误差为零；还用离散正弦特征值的精确衰减独立检查时间积分。

**Outputs / 输出：** [results.json](fra-03/results.json) contains inputs, software versions, normalized script SHA-256, C1/C2 details, grid/time comparisons, Hessian and b₂ ODE residual checks and all 17 checks; [c1-profiles.csv](fra-03/c1-profiles.csv) contains the two convection profiles; [c3-harmonics.csv](fra-03/c3-harmonics.csv) contains all 54 runs/cases. / JSON 保存参数、环境、脚本哈希及核验明细，两个 CSV 保存剖面及全部谐波结果。Reproduction compares content after normalizing platform line endings / 复现比较时统一平台换行。

## 9. Numerical results and convergence / 数值结果及收敛

At λ=0.5, t=0.2, N=256 and c=0.1 / 最细网格、小步长下：

| ε     | Numerical a₂ / 数值 a₂  | a₂/ε²                | Second-order prediction / 二阶预测 |
| ----- | ----------------------- | -------------------- | ---------------------------------- |
| 0.025 | −3.452695019868418×10⁻⁵ | −0.05524312031789468 | −3.452985654975279×10⁻⁵            |
| 0.05  | −1.381056491814196×10⁻⁴ | −0.05524225967256781 | −1.381194261990111×10⁻⁴            |
| 0.1   | −5.523881724594482×10⁻⁴ | −0.05523881724594481 | −5.524777047960446×10⁻⁴            |

**EN** For ε=0.1 the finest numerical value differs from the second-order prediction by +8.95323366×10⁻⁸ (0.0162056% of its magnitude). This is neither zero nor evidence against the expansion: both spatial error and finite-amplitude terms remain. No input was adjusted to match the reference. λ=−0.5 gives the opposite sign, with a₂=+5.523881724594570×10⁻⁴ for ε=0.1; the finest reflected-profile discrepancy between opposite λ is 1.39×10⁻¹⁷. Across λ=0 cases, finest |a₂|≤4.42×10⁻¹⁸, consistent with roundoff-level projection of the heat solution.

**中文** ε=0.1 的数值结果与二阶预测相差 +8.95323366×10⁻⁸，相对预测幅值为 0.0162056%。空间误差与有限幅度项均未消失，因此不能要求精确相等，也没有为匹配参考而调整输入。负 λ 给出反号第二谐波及上述镜像误差；λ=0 的第二谐波处于浮点舍入水平。

For λ=0.5, ε=0.1 and c=0.1 / 固定幅度的空间收敛：

| N intervals / 区间数 | Δt                     | Steps / 步数 | a₂                      |
| -------------------- | ---------------------- | ------------ | ----------------------- |
| 64                   | 2.406738868832732×10⁻⁴ | 831          | −5.517339930440504×10⁻⁴ |
| 128                  | 6.022282445046673×10⁻⁵ | 3321         | −5.522573214320036×10⁻⁴ |
| 256                  | 1.505910699495520×10⁻⁵ | 13281        | −5.523881724594482×10⁻⁴ |

**EN** Successive a₂ differences have ratio ≈4; observed orders over all nonzero-λ cases are 1.9997905–1.9997913. Maximum nested-grid profile differences over all cases fall from 2.66451×10⁻⁶ to 6.66274×10⁻⁷. The continuum λ=0 heat-solution errors give orders 1.9999348 and 1.9999837. Approximately halving Δt changes profiles by at most 9.86×10⁻¹⁶ and a₂ by at most 1.04×10⁻¹⁶; the exact semidiscrete heat error is at most 1.02×10⁻¹⁵. Roundoff limits these time comparisons; they do not measure RK4's formal order.

**中文** 相邻 a₂ 差值约相差四倍，所有非零 λ 的观测空间阶接近 2；嵌套网格剖面差也约缩小四倍。连续热方程误差同样呈二阶收敛。步长近似减半的差异及半离散精确解误差已达舍入量级，因此这里只确认时间误差相对空间误差可忽略，不据此测定 RK4 的四阶形式精度。

**EN** Richardson's estimate a₂,R=a₂,256+(a₂,256−a₂,128)/3 is −5.524317894685964×10⁻⁴ for λ=0.5, ε=0.1. The estimated finest-grid spatial correction is 4.36170091×10⁻⁸; the remaining difference from the second-order prediction is about 4.59153274×10⁻⁸. These are estimates, not an exact finite-ε solution or a rigorous uncertainty interval. For ε=0.025,0.05,0.1, Richardson-scaled differences a₂,R/ε²−b₂ are respectively 2.87142×10⁻⁷, 1.14805×10⁻⁶, 4.59153×10⁻⁶. Their decrease toward zero with ε supports the second-order prediction after spatial-error reduction. On a fixed grid, decreasing ε alone leaves a spatial bias: the continuum limit also requires grid/time refinement.

**中文** Richardson 外推估计将最细网格的空间修正与剩余渐近差异区分开，但它不是有限 ε 精确解，也不是严格误差区间。三组 ε 的外推归一化差异如上，随幅度减小趋近零，支持二阶预测。固定网格下只减小 ε 会留下离散偏差；连续极限还需要网格及步长收敛。

## 10. Connection to FRA-02 and discriminating experiments / 与 FRA-02 的关系及可判别实验

| Question / 问题                                     | Proven or computed here / 本文证明或计算                                                                                                                          | Physical interpretation and next discriminator / 物理解释及后续判别                                                                                                                                                                                                                                                                               |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Q1: steady D/V separation / 稳态分离                | A and C1 exhibit an entire positive-D family with the same prescribed profile and flux / 同剖面及通量允许整族正 D                                                 | Extends FRA02-C03's source–diffusion–non-diffusive balance argument. Source constraints and independently informative transport measurements must accompany a profile; the local construction does not supply a microscopic decomposition. / 延伸 C03 的平衡论证；剖面需结合源及独立输运信息，构造不能提供微观分解。                              |
| Q2: information in perturbations / 扰动信息         | B and C2 identify a Jacobian only when the response matrix has full rank / 满秩时才识别雅可比                                                                     | Aligns with inherited Mordijck tangent/steady distinctions. Use independently shaped perturbations or informative complex phase, characterize sources/boundaries, propagate correlated profile/gradient errors and test on a separate condition. / 结合已有切线／稳态区别，采用独立扰动形状或幅相，约束源与边界并传播相关误差，再作独立工况检验。 |
| Q3: beyond equal linear response / 相同线性响应之外 | C and C3 show a differing Hessian and finite-amplitude second harmonics despite equal steady/tangent behavior / 同稳态、同切线仍有不同 Hessian 及有限幅度二次谐波 | Makes FRA02-C04's explanation-versus-prediction boundary explicit. A density-modulation amplitude scan and the amplitude/phase of the second harmonic can constrain candidate closures, alongside withheld perturbation conditions. / 明确 C04 中解释与预测的边界；幅度扫描、二次谐波幅相及留出扰动可约束候选闭合。                               |

**EN** A useful future experiment would (i) define a matched reference state and geometry; (ii) measure density response, source waveform/spatial uncertainty and boundary flux consistently; (iii) vary modulation amplitude sufficiently to separate an ε² component while retaining a small-perturbation regime; (iv) quantify the rank/conditioning of independent perturbations; and (v) predict a withheld amplitude, frequency or spatial forcing rather than refitting every case. Temperature, rotation, impurity and fast-ion responses should be constrained rather than silently held fixed.

**中文** 后续实验应固定可比背景与几何，一致测量密度响应、源波形／空间误差及边界通量；在仍可解释为小扰动的范围扫描幅度并分离 ε² 分量；量化独立扰动的秩与条件数；最后预测留出的幅度、频率或空间激励，而不是每个工况重新拟合。温度、旋转、杂质和快离子联动需约束，不能默认为不变。

**EN** A measured second harmonic could originate in transport nonlinearity, nonlinear/modulated sources, boundaries, diagnostic response or coupled state variables. Its presence alone does not identify a particular turbulence mechanism, nor uniquely determine λ. The present three-λ example is a discriminating mathematical counterexample under ideal known inputs; it is not a validated tokamak closure or a reconstruction of one of the cited experiments.

**中文** 实测二次谐波可能来自输运、源、边界、诊断或耦合状态的非线性。其存在不能直接证明某个湍流机制，也不能唯一确定 λ。本文三组 λ 只是在理想已知输入下可判别的数学反例，不是经验证的托卡马克闭合或所引实验的重建。

## 11. Verification status and remaining gaps / 核验状态与证据缺口

**EN** A–C and the second-order formula are established within the stated mathematical assumptions. C1–C3 were actually executed; all 17 numerical checks pass, with three spatial grids and two time-step factors. Reproduction instructions and complete inputs are in the public script; the supplied reference is compared with its second-order prediction rather than imposed on finite-amplitude output. This checks the implementation and analytic examples. It does not constitute independent replication of the papers or physical validation of the closure family.

**中文** 在明示假设下已证明 A–C 及二阶公式；实际执行 C1–C3，三网格、两步长因子的 17 项核验通过。脚本包含全部输入和复现方式；参考值用于比较二阶预测，没有作为有限幅度解的强制目标。这是实现与解析算例核验，不是论文独立复现或闭合族的物理验证。

**EN** Remaining gaps are Gentle's abstract/full text, full methods of Karalashvili beyond the deposited abstract, full-article/code replication for van Kampen, experimental source/boundary covariance and multi-state dynamics, noisy-data conditioning, and independent nonlinear/experimental discrimination. No new source/finding IDs or graph relations were added. All five existing sources retain `independent=not_checked`; graph counts remain 31 nodes, 53 edges, 5 sources and literature counts 5/5/0. No website feature, Release, deployment or next-phase project is part of FRA-03.

**中文** 尚缺 Gentle 摘要与全文、Karalashvili 摘要以外的方法核查、van Kampen 完整论文及代码复现、实验源／边界协方差与多状态动态、噪声条件数评估，以及独立非线性或实验判别。没有新增 source/finding ID 或图谱关系；五个来源独立状态仍为未检查，计数保持不变。本轮不开发网站功能，不发布或部署，也不启动下一阶段。
