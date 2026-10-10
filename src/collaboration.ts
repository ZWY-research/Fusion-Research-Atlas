export const repository =
  "https://github.com/ZWY-research/Fusion-Research-Atlas";
export const contributionKinds = [
  "research-question",
  "evidence-contribution",
  "scientific-challenge",
  "verification-proposal",
] as const;
export function contributionUrl(kind: (typeof contributionKinds)[number]) {
  const body = [
    "## Scientific question / 科学问题",
    "",
    "## Research domains / 研究领域",
    "",
    "## Existing understanding / 现有认识",
    "",
    "## New evidence or hypothesis / 新证据或假设",
    "",
    "## DOI or traceable source / DOI 或可追溯来源",
    "",
    "## Physical scope and limitations / 物理适用范围与限制",
    "",
    "## Proposed verification / 建议验证方式",
    "",
    "## Counterevidence / 相反证据",
    "",
    "Please share only material you have permission to make public.",
  ].join("\n");
  return (
    repository +
    "/issues/new?" +
    new URLSearchParams({ title: "[" + kind + "] ", body }).toString()
  );
}
