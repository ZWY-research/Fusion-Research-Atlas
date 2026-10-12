export const repository =
  "https://github.com/ZWY-research/Fusion-Research-Atlas";
export const contributionKinds = [
  "research-question",
  "evidence-contribution",
  "scientific-challenge",
  "verification-proposal",
] as const;
export function contributionUrl(kind: (typeof contributionKinds)[number]) {
  return (
    repository +
    "/issues/new?" +
    new URLSearchParams({ template: kind + ".yml" }).toString()
  );
}
