import { text } from "./model";
import type { Atlas, AtlasNode, Language } from "./model";
import { ui } from "./i18n";
import { CitationList } from "./Evidence";
import { buildQuestionOverview } from "./questionOverviewData";

export function QuestionOverview({
  atlas,
  language: l,
  questionId,
  onNode,
  onSource,
}: {
  atlas: Atlas;
  language: Language;
  questionId: string;
  onNode: (id: string) => void;
  onSource: (id: string) => void;
}) {
  const overview = buildQuestionOverview(atlas, questionId);
  const t = (key: Parameters<typeof ui>[0]) => ui(key, l);
  const related = (node: AtlasNode) => {
    const ids = new Set(
      atlas.edges
        .filter((e) => e.source === node.id || e.target === node.id)
        .flatMap((e) => [e.source, e.target]),
    );
    return atlas.nodes.filter(
      (n) =>
        n.id !== node.id &&
        n.contentStatus === "research_record" &&
        ids.has(n.id) &&
        (node.kind !== "method" || ["question", "gap"].includes(n.kind)),
    );
  };
  if (!overview)
    return (
      <main
        className="content-panel question-overview"
        data-testid="overview-unavailable"
      >
        <h2>{t("overviewUnavailable")}</h2>
        <p>{t("overviewUnavailableNote")}</p>
        <button className="primary" onClick={() => onNode("q-density")}>
          {t("backAtlas")}
        </button>
      </main>
    );
  return (
    <main
      className="content-panel question-overview"
      data-testid="question-overview"
    >
      <header className="overview-heading">
        <div className="eyebrow">
          RESEARCH QUESTION OVERVIEW · {overview.question.id}
        </div>
        <h2>{text(overview.question.label, l)}</h2>
        <p>{t("overviewScope")}</p>
        <div className="notice">{t("overviewEvidenceNote")}</div>
        <p className="overview-observables">{t("overviewObservables")}</p>
        <button
          className="primary"
          onClick={() => onNode(overview.question.id)}
        >
          {t("backAtlas")}
        </button>
      </header>
      <nav className="overview-toc" aria-label={t("overviewSections")}>
        {overview.sections.map((section, i) => (
          <a
            key={section.id}
            href={"#overview-" + section.id}
            onClick={(event) => {
              event.preventDefault();
              document
                .getElementById("overview-" + section.id)
                ?.scrollIntoView({ block: "start" });
            }}
          >
            0{i + 1} · {text(section.title, l)}
          </a>
        ))}
      </nav>
      <div className="overview-sources" aria-label={t("sources")}>
        <span>
          {t("sources")} ({overview.sources.length})
        </span>
        {overview.sources.map((s) => (
          <button
            key={s.id}
            data-testid={"overview-source-" + s.id}
            title={s.title}
            onClick={() => onSource(s.id)}
          >
            {s.authors[0]} · {s.year} ↗
          </button>
        ))}
      </div>
      {overview.sections.map((section, i) => (
        <section
          className="overview-section"
          id={"overview-" + section.id}
          key={section.id}
          data-testid={"overview-section-" + section.id}
          aria-labelledby={"overview-title-" + section.id}
        >
          <div className="overview-section-heading">
            <span className="step-number">0{i + 1}</span>
            <div>
              <h3 id={"overview-title-" + section.id}>
                {text(section.title, l)}
              </h3>
              <p>{text(section.introduction, l)}</p>
            </div>
          </div>
          {section.missing.length > 0 && (
            <p className="notice" role="status">
              {t("overviewMissing")} {section.missing.join(", ")}
            </p>
          )}
          <div className="overview-cards">
            {section.nodes.map((node) => (
              <article
                key={node.id}
                className={
                  "overview-card " +
                  (node.contentStatus === "demonstration"
                    ? "overview-definition"
                    : "")
                }
                data-testid={"overview-node-" + node.id}
                data-content-status={node.contentStatus}
                data-epistemic-status={node.epistemicStatus}
              >
                <div className="overview-badges">
                  <span className="badge">{t(node.contentStatus)}</span>
                  <span className="status">{t(node.epistemicStatus)}</span>
                  <span className="badge">
                    {node.kind === "evidence"
                      ? t("overviewEvidenceKind")
                      : t(node.kind)}
                  </span>
                </div>
                <h4>{text(node.label, l)}</h4>
                <p>{text(node.summary, l)}</p>
                <div className="overview-source-links">
                  {[...new Set(node.citations.map((c) => c.sourceId))].map(
                    (id) => {
                      const s = atlas.sources.find((s) => s.id === id);
                      return (
                        s && (
                          <button key={id} onClick={() => onSource(id)}>
                            {s.authors[0]} · {s.year} · {t(s.sourceType)} ↗
                          </button>
                        )
                      );
                    },
                  )}
                </div>
                {node.contentStatus === "demonstration" && (
                  <p className="overview-boundary">
                    {t("overviewDefinitionNote")}
                  </p>
                )}
                <button className="primary" onClick={() => onNode(node.id)}>
                  {t("viewGraphNode")} →
                </button>
                {node.kind === "method" && (
                  <div className="overview-related">
                    <span>{t("overviewRelatedQuestion")}</span>
                    {related(node).map((n) => (
                      <button key={n.id} onClick={() => onNode(n.id)}>
                        {text(n.label, l)} →
                      </button>
                    ))}
                  </div>
                )}
                <details>
                  <summary>
                    {t("overviewDetails")} · {node.citations.length}
                  </summary>
                  <p>{text(node.details, l)}</p>
                  {node.kind !== "method" && (
                    <div className="overview-related">
                      {related(node).map((n) => (
                        <button key={n.id} onClick={() => onNode(n.id)}>
                          {text(n.label, l)} →
                        </button>
                      ))}
                    </div>
                  )}
                  <CitationList
                    citations={node.citations}
                    sources={atlas.sources}
                    language={l}
                    onSource={onSource}
                    referencePrefix={
                      "overview-" + section.id + "-" + node.id + "-"
                    }
                  />
                </details>
              </article>
            ))}
            {section.findings.map(
              ({ source, finding, relatedNodes, citation }) => (
                <article
                  className="overview-card overview-finding"
                  key={source.id + finding.id}
                  data-testid={"overview-finding-" + finding.id}
                  data-source-id={source.id}
                >
                  <div className="overview-badges">
                    <span className="badge">
                      {t("overviewReportedFinding")}
                    </span>
                    <span className="badge">
                      {t(source.sourceType)} · {t(finding.scope)}
                    </span>
                  </div>
                  <h4>
                    {source.authors[0]} · {source.year}
                  </h4>
                  <p>{text(finding.statement, l)}</p>
                  <p className="overview-checks">
                    {t("overviewSourceClaim")}:{" "}
                    {t(source.verificationStatus.claim)} · {t("independent")}:{" "}
                    {t(source.verificationStatus.independent)}
                  </p>
                  <button
                    className="primary"
                    onClick={() => onSource(source.id)}
                  >
                    {t("openSource")} ↗
                  </button>
                  <a
                    className="doi-link"
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {source.doi || t("unknownDoi")} ↗
                  </a>
                  <details>
                    <summary>{t("overviewConditions")}</summary>
                    <p>
                      <code>{finding.id}</code>
                    </p>
                    <p>
                      {t("locator")}: {text(finding.locator, l)}
                    </p>
                    <p>
                      {t("conditions")}: {text(finding.conditions, l)}
                    </p>
                    <p>
                      {t("limitations")}: {text(finding.limitations, l)}
                    </p>
                    <div className="overview-related">
                      {relatedNodes.map((n) => (
                        <button key={n.id} onClick={() => onNode(n.id)}>
                          {t("viewGraphNode")}: {text(n.label, l)} →
                        </button>
                      ))}
                    </div>
                    {citation && (
                      <CitationList
                        citations={[citation]}
                        sources={atlas.sources}
                        language={l}
                        onSource={onSource}
                        referencePrefix={
                          "overview-" + section.id + "-" + finding.id + "-"
                        }
                      />
                    )}
                  </details>
                </article>
              ),
            )}
          </div>
        </section>
      ))}
    </main>
  );
}
