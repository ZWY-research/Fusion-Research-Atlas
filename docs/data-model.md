# FRA data model 0.2

`public/data/electron-density.json` is independent offline graph data; `src/model.ts` validates it at build time and runtime. `src/content/framework.json` provides bilingual domains, research goals, methodology and participation categories.

## Separate dimensions

| Dimension          | Purpose                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| domainIds          | Many-to-many scientific research scope                                                                        |
| kind               | Question / Phenomenon / Knowledge / Hypothesis / Evidence / Gap / Verification (`method`)                     |
| contentStatus      | demonstration or research_record                                                                              |
| epistemicStatus    | open_question, unassessed, background, candidate_hypothesis, research_plan, conditional, supported, contested |
| sourceType         | journal_article, preprint, experimental_data, simulation, theoretical_derivation, research_report             |
| verificationStatus | Independent metadata, abstract, fullText, claim and independent checks                                        |

All visible scientific content has `zh` and `en` fields. IDs, DOI, endpoints and relation codes do not depend on language. Source titles and author names preserve the original bibliographic identity. Existing node and edge IDs are unchanged.

## Evidence records

Sources also distinguish demonstration from research_record content; demonstration sources cannot claim completed verification. Sources contain title, authors in order, collectiveAuthors, journal, year, volume/issue/pages, normalized DOI or an explicit missing-DOI reason, traceable URL, sourceType, researchConditions, reportedFindings, limitations, verificationStatus, verifiedAt, metadataSources and readingScope. Findings carry stable IDs, scope, locator, conditions and limitations.

DOI normalization accepts DOI strings or encoded resolver URLs, preserves suffix punctuation, and lowercases identity. Resolver URL construction encodes reserved characters safely. Missing journal DOI requires a reason and alternative HTTPS URL. `verify:doi` compares DOI, title, full ordered author list, year and journal against Crossref; it records results without modifying scientific verification flags. The build compares saved metadata snapshots offline.

## Node and relationship citations

Each citation references a source and optionally a specific finding, with role context/support/challenge, reading scope, statement, conditions, locator and a claimVerified flag. Support/challenge requires a specific finding. No citation may exceed actually read material. Metadata checks cannot establish claim or independent verification. Demonstration objects cannot be promoted to supported conclusions or verified claims by attaching a real DOI. A candidate hypothesis can cite real literature without becoming verified.

The source records and literature catalogue specify each paper’s actual reading and checking scope. Angioni 2003 remains at metadata/abstract level; four other papers have completed source-based studies with bounded full-text findings. Angioni 2012 full-text and claim checks are inherited from the supplied scientific handoff, with ingestion provenance stated in its limitations and literature page. Research records can carry conditional, claim-checked support; demonstration citations remain context only. None of the five papers has independent replication recorded. No counterevidence indexed does not mean counterevidence is absent.

来源记录与文献目录分别说明各篇实际阅读及核查范围。Angioni 2003 仍为书目／摘要级，其余四篇已完成有边界的来源研读。Angioni 2012 的全文与主张核查继承所提供科研交接材料，入库来源边界在 limitations 与评议页明确说明。科研记录可保留有条件的主张支持；演示对象引用仍仅为背景。五篇均未记录独立复现；未收录反证不代表没有反证。

## Compatibility

`parseAtlas` accepts the V0.2 schema or explicitly migrates V0.1 no-source data, preserving IDs, positions, endpoints, semantics and method type. Migration does not infer formal research records or scientific verification from old status values. Legacy Chinese-only text is marked translation pending in the migration; the active V0.2 dataset has complete reviewed English descriptions. Legacy sources require explicit metadata migration and are rejected instead of fabricated.

`tests/fixtures/v0.1.json` provides exact original graph regression evidence. Validate all old IDs, endpoint semantics, domains, citations and DOI metadata before changes. Future genuinely supported conclusions require explicit scope and independently assessed evidence; schema validation is necessary but cannot prove scientific truth.
