# Contributing to Fusion Research Atlas

Researchers may contribute in English or Chinese. Please distinguish questions, candidate hypotheses, measured results and literature context.

## Ways to participate

Use the repository Issues for research questions, evidence contributions, scientific challenges and verification proposals. Four Issue Forms are maintained under `.github/ISSUE_TEMPLATE/` in the default branch. The V0.2 website links directly to the corresponding form using its template filename.

Include the scientific question, relevant domains, existing understanding, new evidence or hypothesis, DOI or alternative traceable source, physical conditions, limitations, competing explanations and proposed verification. A GitHub account is required to submit an issue; FRA has no separate account system.

## DOI and evidence

Use real DOI resolver links. Preserve legal suffix characters; normalize case without truncating punctuation. If a paper has no DOI, disclose that explicitly and provide a traceable alternative source. Compare DOI, title, all authors in order, year and journal. Record collective authors separately where registry metadata omits them.

Metadata identity does not verify a scientific claim. Record whether you checked the abstract or full text, the exact finding/figure locator, physical conditions, limitations and counterevidence. Never imply full-text review if you only read an abstract. Independent verification requires separate evidence, not a second metadata provider.

## Graph changes

Do not change existing node, relationship or source IDs to translate content. Use `zh` and `en` localized fields. `method` remains the legacy-compatible key for Verification. Domain, content status, epistemic status, source type and verification fields are independent.

Add traceable citations with role `context`, `support` or `challenge`. Context does not promote a demonstration to a research record. A hypothesis can cite a real paper and remain unverified. Do not commit private experiments, credentials, copyrighted full text or unlicensed materials.

Before opening a PR, run `npm ci`, `npm run validate:data`, `npm run typecheck`, `npm test`, `npm run lint`, `npm run build` and real browser tests. Use a feature branch; do not deploy unreviewed scientific changes to main.

欢迎提交清晰问题、真实 DOI、适用范围与可执行的验证方案。请保留已有 ID，为所有面向研究人员的内容提供英文表达，并明确区分示例、书目核验和科学验证。
