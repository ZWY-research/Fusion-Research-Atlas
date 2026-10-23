import type { Atlas, Citation, Localized } from "./model.ts";

export const comparisonQuestionId = "q-density";
export const comparisonRecordPath =
  "docs/literature/comparisons/q-density-cross-study-comparison.md";
// Branch link keeps the new record accessible during PR review, before merge.
export const comparisonRecordUrl =
  "https://github.com/ZWY-research/Fusion-Research-Atlas/blob/feat/fra-02-cross-study-comparison/" +
  comparisonRecordPath;

type StudyDefinition = {
  sourceId: string;
  reviewFile: string;
  evidenceType: Localized;
  observable: Localized;
  methods: Localized;
  findingIds: readonly string[];
};

// Small editorial navigation map; source statements, conditions, limits and
// verification states are resolved from Atlas, never copied into this map.
export const comparisonStudies: readonly StudyDefinition[] = [
  {
    sourceId: "paper-angioni-2003",
    reviewFile: "angioni-2003.md",
    evidenceType: {
      zh: "实验关联与条件性模型干预",
      en: "Experimental association and conditional model intervention",
    },
    observable: {
      zh: "Fig. 1：n_e(ρψ=0.4)/n_e(ρψ=0.8)；后续模型导数采用 ρ=aρφ，不能直接互换。",
      en: "Fig. 1: n_e(ρψ=0.4)/n_e(ρψ=0.8); later model derivatives use ρ=aρφ. These coordinates are not interchangeable.",
    },
    methods: {
      zh: "分组观测；ASTRA / GLF23；碰撞项消融、增量通量与 Ware 开关。",
      en: "Grouped observations; ASTRA / GLF23; collision ablation, incremental flux and Ware switches.",
    },
    findingIds: [
      "finding-2003",
      "finding-a03-collision-ablation",
      "finding-a03-incremental-flux",
      "finding-a03-effective-pinch",
      "finding-a03-ware-competition",
    ],
  },
  {
    sourceId: "paper-angioni-2007",
    reviewFile: "angioni-2007.md",
    evidenceType: {
      zh: "联合数据库经验回归与外推",
      en: "Combined-database empirical regression and extrapolation",
    },
    observable: {
      zh: "n_e(ρpol=0.2)/⟨n_e⟩Vol；343 个 AUG 与 277 个 JET 观测，不等于 620 炮独立放电。",
      en: "n_e(ρpol=0.2)/⟨n_e⟩Vol; 343 AUG and 277 JET observations, not 620 established independent discharges.",
    },
    methods: {
      zh: "五弦一致性反演；稳健回归；束源估计与 ITER 外推。",
      en: "Common five-chord inversion; robust regression; beam-source estimates and ITER extrapolation.",
    },
    findingIds: [
      "finding-a07-covariance",
      "finding-a07-source",
      "finding-a07-prediction",
    ],
  },
  {
    sourceId: "paper-greenwald-2007",
    reviewFile: "greenwald-2007.md",
    evidenceType: {
      zh: "跨装置经验检验，无 NBI",
      en: "Cross-device empirical test, without NBI",
    },
    observable: {
      zh: "n_e(0.2)/⟨n_e⟩ 及两点比值；原刊环向磁通措辞需与 AUG/JET 极向坐标核对。",
      en: "n_e(0.2)/⟨n_e⟩ and two-radius ratios; the letter’s toroidal-flux wording requires alignment with AUG/JET poloidal coordinates.",
    },
    methods: {
      zh: "C-Mod 51 炮；与已有 AUG/JET 定标作训练装置以外的比较。",
      en: "51 C-Mod discharges; comparison with AUG/JET scalings outside the training devices.",
    },
    findingIds: [
      "finding-g07-peaking",
      "finding-g07-discrimination",
      "finding-g07-transfer",
    ],
  },
  {
    sourceId: "paper-mordijck-2020",
    reviewFile: "mordijck-2020.md",
    evidenceType: {
      zh: "三炮扫描、扰动反演与条件性模拟",
      en: "Three-discharge scan, perturbative inversion and conditional simulation",
    },
    observable: {
      zh: "局部 R/L_ne，部分在 ρ≈0.5–0.8 平均；3 Hz 扰动系数与重建稳态系数须区分。",
      en: "Local R/L_ne, partly averaged over ρ≈0.5–0.8; distinguish 3 Hz perturbative coefficients from reconstructed steady coefficients.",
    },
    methods: {
      zh: "TS、反射计、CER、BES/DBS；OMFIT/Gaprofiles；GENE 线性、TGLF-SAT1。",
      en: "TS, reflectometry, CER, BES/DBS; OMFIT/Gaprofiles; linear GENE and TGLF-SAT1.",
    },
    findingIds: [
      "finding-m20-scan",
      "finding-m20-modulation",
      "finding-m20-tangent-steady",
      "finding-m20-source-ratio",
      "finding-m20-models",
      "finding-m20-coupled-state",
    ],
  },
  {
    sourceId: "paper-angioni-2012",
    reviewFile: "angioni-2012-off-diagonal-transport.md",
    evidenceType: {
      zh: "专题综述与理论综合，非独立实验",
      en: "Topical survey and theoretical synthesis, not an independent experiment",
    },
    observable: {
      zh: "局部梯度、模实频及非对角通量分解；各引用研究的源、坐标和运行条件不同。",
      en: "Local gradients, mode real frequencies and off-diagonal flux decomposition; cited studies differ in sources, coordinates and regimes.",
    },
    methods: {
      zh: "回旋动理学／准线性分析、能量共振与 ITG/TEM；引用的多装置实验及模型。",
      en: "Gyrokinetic/quasilinear analysis, energy resonance and ITG/TEM; cited multi-device experiments and models.",
    },
    findingIds: [
      "finding-a12-flux-decomposition",
      "finding-a12-resonance-sign",
      "finding-a12-frequency-peaking",
      "finding-a12-energy-selection",
    ],
  },
];

export function buildStudyComparison(atlas: Atlas, questionId: string) {
  const question = atlas.nodes.find(
    (n) => n.id === questionId && n.kind === "question",
  );
  if (questionId !== comparisonQuestionId || !question) return null;
  const missing: string[] = [];
  const studies = comparisonStudies.flatMap((definition) => {
    const source = atlas.sources.find(
      (s) =>
        s.id === definition.sourceId && s.contentStatus === "research_record",
    );
    if (!source) {
      missing.push(definition.sourceId);
      return [];
    }
    const findings = definition.findingIds.flatMap((id) => {
      const finding = source.reportedFindings.find((f) => f.id === id);
      if (!finding) {
        missing.push(source.id + "/" + id);
        return [];
      }
      const matches = (c: Citation) =>
        c.sourceId === source.id && c.findingId === id;
      const relatedNodes = atlas.nodes.filter(
        (n) =>
          n.contentStatus === "research_record" && n.citations.some(matches),
      );
      const citations = [...atlas.nodes, ...atlas.edges]
        .flatMap((item) => item.citations)
        .filter(matches);
      const citation =
        citations.find((c) => c.role !== "context") || citations[0];
      return [{ finding, relatedNodes, citation }];
    });
    return [{ ...definition, source, findings }];
  });
  return { question, studies, missing };
}
