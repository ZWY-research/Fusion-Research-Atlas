# Fusion Research Atlas

Fusion Research Atlas is an open, collaborative and evolving atlas of scientific questions and research progress in fusion science, organized around scientific evidence.

Fusion Research Atlas 是一个开放协作、由科学证据驱动、持续演化的聚变科学问题与研究进展图谱。

- Repository: https://github.com/ZWY-research/Fusion-Research-Atlas
- Published V0.1: https://zwy-research.github.io/Fusion-Research-Atlas/
- **V0.2 is local development on `feature/v0.2-science-framework`; it has not been deployed.**

## Research platform

The website combines About FRA, Scientific Domains, Research Methodology, Evidence & Verification, an interactive Cytoscape atlas and Open Collaboration. The atlas remains the default view; English and Chinese UI and scientific fields share stable identifiers. Node and relationship selections support hash deep links.

FRA identifies phenomena, organizes existing understanding, exposes model limitations, studies competing mechanisms, develops verification paths, tracks changes in evidence and explores connections between questions. Physical laws provide the foundation; experimental, simulation, mathematical and literature evidence constrain understanding. New hypotheses require distinguishable predictions, and understanding remains revisable.

## Scientific domains and progress

Eight maintained domains cover particle/heat/momentum transport, turbulence/microinstabilities, MHD/stability, heating/current drive, edge/plasma-wall interaction, burning plasma physics, diagnostics/measurements and integrated modeling/control. Only tokamak electron-density transport and density peaking has a demonstration subgraph. Other dedicated domain atlases are future scope, not completed research.

## Objects, evidence and DOI

Seven object types: Question, Phenomenon, Knowledge, Hypothesis, Evidence, Gap and Verification (`method` remains compatible). Version 0.2 separates domain IDs, `contentStatus`, `epistemicStatus`, source type and five verification dimensions. Existing 15 object IDs, 20 relationship IDs and endpoints are preserved. The versioned migration supports the V0.1 no-source dataset; richer legacy bibliographies require explicit migration rather than fabricated metadata.

Two real papers have Crossref and publisher bibliographic checks, with narrowly scoped abstract-level findings: `10.1103/physrevlett.90.205003` and `10.1088/0029-5515/47/9/033`. Their context citations do not verify the demonstration graph. Metadata checks are separate from abstract/full-text review, claim verification and independent validation. Full text and figures have not been checked. The website uses saved records and does not depend on Crossref at runtime. See [data and evidence model](docs/data-model.md).

**The atlas remains demonstration data and candidate hypotheses, not new experimental findings or verified mechanisms.** Evidence nodes are evidence requirements. Real literature records do not make demonstration objects formal research results. Existing statements retain their original limitations. 来源核对不等于科学结论核验。

## Research methodology

Phenomenon Identification → Existing Knowledge → Scientific Questions → Competing Hypotheses → Evidence Assessment → Verification Design → Knowledge Update. Website cards specify actions, inputs, outputs and update criteria. Physical conditions, assumptions, uncertainty, experiment/simulation comparisons, counterevidence and falsifiable predictions matter more than formal checklists.

## International participation

English and Chinese contributions are welcome through GitHub: Research Question, Evidence Contribution, Scientific Challenge or Verification Proposal. Ready-to-integrate Issue Forms are local; current website buttons use existing prefilled issue composers until reviewed merge. See [CONTRIBUTING](CONTRIBUTING.md). Share only material with public permission.

## Development and verification

Node.js 24 and npm are required.

```powershell
npm ci
npm run dev -- --host 127.0.0.1
```

Open `/Fusion-Research-Atlas/` on the terminal's port. For production preview:

```powershell
npm run validate:data
npm run typecheck
npm test
npm run lint
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

Real Chrome tests:

```powershell
$env:FRA_BROWSER_CHANNEL = 'chrome'
npm run test:browser
```

Without installed Chrome, run `npx playwright install chromium` and omit the channel variable. Screenshots default to test-results/screenshots; FRA_SCREENSHOT_DIR can select a local review directory. Optional `npm run verify:doi -- --output <report.json>` rechecks DOI/title/authors/year/journal against Crossref without promoting scientific statuses.

## GitHub Pages and licensing

Vite base is `/Fusion-Research-Atlas/`. The existing main-only Actions workflow uses Node.js 24, validates/tests/builds and uploads dist through official Pages Actions. **Do not push main, merge or deploy V0.2 until independent review.** Feature development leaves V0.1 online.

Original source code and original illustrative descriptions use MIT License. Bibliographic facts and short original abstract-level summaries do not grant rights to publisher full text, figures or future datasets. Obtain separate permission for copyrighted or private materials; no paper full text or private experiments are bundled in the repository.
