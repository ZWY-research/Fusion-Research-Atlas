import type { Atlas, AtlasNode, Citation, Localized, Source } from "./model.ts";

export const overviewQuestionId = "q-density";
type FindingRef = { sourceId: string; findingId: string };
type SectionDefinition = {
  id: string;
  title: Localized;
  introduction: Localized;
  nodeIds: readonly string[];
  findings: readonly FindingRef[];
};

// Editorial navigation only. Scientific text and states always come from Atlas.
export const questionOverviewSections: readonly SectionDefinition[] = [
  {
    id: "question",
    title: { zh: "科学问题", en: "Scientific Question" },
    introduction: {
      zh: "从问题与现象定义进入研究。示例对象仅作定义入口；实测认识须查看科研记录及其来源。",
      en: "Start with the question and phenomenon definitions. Demonstration objects are definition entry points; observations belong to research records and their sources.",
    },
    nodeIds: [
      "q-density",
      "p-peaking",
      "p-cmod-low-collisionality",
      "p-diiid-peaking",
    ],
    findings: [],
  },
  {
    id: "knowledge",
    title: { zh: "已有认识", en: "Established Knowledge" },
    introduction: {
      zh: "按各记录的条件理解经验与输运认识，不将它们视为普适因果律。无 NBI 不等于零总粒子源。",
      en: "Read empirical and transport knowledge within each record’s conditions, rather than as universal causal laws. No NBI does not mean zero total particle source.",
    },
    nodeIds: [
      "k-collisionality-evidence",
      "k-diiid-source-transport",
      "k-a12-state-dependent-flux",
    ],
    findings: [],
  },
  {
    id: "mechanisms",
    title: { zh: "候选机制", en: "Candidate Mechanisms" },
    introduction: {
      zh: "结合热扩散、曲率相关箍缩和 Ware 的理论／模型证据阅读候选解释。区分模型结果、作者解释与候选假设；ITG/TEM 线性标签不独自确定非线性净通量方向。",
      en: "Read candidates alongside theoretical/model evidence for thermodiffusion, curvature-related pinch and Ware transport. Distinguish model results, author interpretations and hypotheses; linear ITG/TEM labels alone do not determine nonlinear net flux direction.",
    },
    nodeIds: ["h-diiid-coupled-turbulence"],
    findings: [
      {
        sourceId: "paper-angioni-2003",
        findingId: "finding-a03-incremental-flux",
      },
      {
        sourceId: "paper-angioni-2003",
        findingId: "finding-a03-effective-pinch",
      },
      {
        sourceId: "paper-angioni-2003",
        findingId: "finding-a03-ware-competition",
      },
      {
        sourceId: "paper-angioni-2012",
        findingId: "finding-a12-flux-decomposition",
      },
      {
        sourceId: "paper-angioni-2012",
        findingId: "finding-a12-resonance-sign",
      },
    ],
  },
  {
    id: "evidence",
    title: { zh: "关键证据", en: "Key Evidence" },
    introduction: {
      zh: "沿既有实验、模型与综述来源追踪证据。展开条件、定位和限制，再判断一项证据能支持什么。",
      en: "Trace evidence through the existing experimental, model and survey sources. Expand conditions, locators and limits before judging what an item supports.",
    },
    nodeIds: [
      "e-cmod-transfer",
      "e-diiid-modulation",
      "e-diiid-turbulence-models",
      "e-a12-frequency-peaking",
      "k-a12-momentum-coupling",
    ],
    findings: [
      { sourceId: "paper-angioni-2003", findingId: "finding-2003" },
      {
        sourceId: "paper-angioni-2003",
        findingId: "finding-a03-collision-ablation",
      },
      { sourceId: "paper-angioni-2007", findingId: "finding-a07-covariance" },
      { sourceId: "paper-angioni-2007", findingId: "finding-a07-prediction" },
    ],
  },
  {
    id: "questions",
    title: { zh: "未解决问题", en: "Open Questions" },
    introduction: {
      zh: "分别识别参数协变、机制／模型判别、稳态与扰动闭合，以及频率／谱与通量之间的困难，不将它们笼统归为“尚缺实验”。",
      en: "Distinguish parameter covariance, mechanism/model discrimination, steady/perturbative closure and frequency/spectrum-to-flux difficulties, rather than reducing them all to missing experiments.",
    },
    nodeIds: [
      "q-collisionality-transfer",
      "g-flux-identification",
      "q-perturbative-steady",
    ],
    findings: [],
  },
  {
    id: "next",
    title: { zh: "下一步研究", en: "Next Verification" },
    introduction: {
      zh: "以下为既有研究计划，尚未执行。查看目标、方法、相关问题和来源中的判别条件；计划不表示实验或复现已经完成。",
      en: "These are existing, unperformed research plans. Inspect their aims, methods, related questions and source-specific discriminants; a plan does not establish completed experiments or reproduction.",
    },
    nodeIds: ["m-cross-device-validation", "m-diiid-discriminating-tests"],
    findings: [],
  },
];

export type OverviewFinding = {
  source: Source;
  finding: Source["reportedFindings"][number];
  relatedNodes: AtlasNode[];
  citation: Citation | undefined;
};

export function buildQuestionOverview(atlas: Atlas, questionId: string) {
  const question = atlas.nodes.find(
    (n) => n.id === questionId && n.kind === "question",
  );
  if (questionId !== overviewQuestionId || !question) return null;
  const referencedSources = new Set<string>();
  const sections = questionOverviewSections.map((definition) => {
    const missing: string[] = [];
    const nodes: AtlasNode[] = [];
    for (const id of new Set(definition.nodeIds)) {
      const node = atlas.nodes.find((n) => n.id === id);
      const isDefinition =
        definition.id === "question" && ["q-density", "p-peaking"].includes(id);
      if (!node || (node.contentStatus === "demonstration" && !isDefinition)) {
        missing.push(id);
        continue;
      }
      nodes.push(node);
      for (const c of node.citations) referencedSources.add(c.sourceId);
    }
    const findings: OverviewFinding[] = [];
    const seen = new Set<string>();
    for (const ref of definition.findings) {
      const key = ref.sourceId + "/" + ref.findingId;
      if (seen.has(key)) continue;
      seen.add(key);
      const source = atlas.sources.find((s) => s.id === ref.sourceId);
      const finding = source?.reportedFindings.find(
        (f) => f.id === ref.findingId,
      );
      if (!source || !finding || source.contentStatus !== "research_record") {
        missing.push(key);
        continue;
      }
      const matches = (c: Citation) =>
        c.sourceId === source.id && c.findingId === finding.id;
      const relatedNodes = atlas.nodes.filter(
        (n) =>
          n.contentStatus === "research_record" && n.citations.some(matches),
      );
      findings.push({
        source,
        finding,
        relatedNodes,
        citation: relatedNodes.flatMap((n) => n.citations).find(matches),
      });
      referencedSources.add(source.id);
    }
    return { ...definition, nodes, findings, missing };
  });
  return {
    question,
    sections,
    sources: atlas.sources.filter((s) => referencedSources.has(s.id)),
  };
}

export function isOverviewNode(id: string) {
  return questionOverviewSections.some((section) =>
    section.nodeIds.includes(id),
  );
}
