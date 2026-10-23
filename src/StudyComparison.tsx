import type { Atlas, Language } from "./model";
import { text } from "./model";
import { ui } from "./i18n";
import { CitationList } from "./Evidence";
import { repository } from "./collaboration";
import {
  buildStudyComparison,
  comparisonRecordUrl,
} from "./studyComparisonData";

export function StudyComparison({
  atlas,
  language: l,
  questionId,
  onNode,
  onSource,
  onOverview,
}: {
  atlas: Atlas;
  language: Language;
  questionId: string;
  onNode: (id: string) => void;
  onSource: (id: string) => void;
  onOverview: () => void;
}) {
  const comparison = buildStudyComparison(atlas, questionId);
  const t = (key: Parameters<typeof ui>[0]) => ui(key, l);
  if (!comparison)
    return (
      <main
        className="content-panel study-comparison"
        data-testid="comparison-unavailable"
      >
        <h2>{t("comparisonUnavailable")}</h2>
        <p>{t("overviewUnavailableNote")}</p>
        <button className="primary" onClick={() => onNode("")}>
          {t("backAtlas")}
        </button>
      </main>
    );
  const columns = [
    "comparisonStudy",
    "comparisonConditions",
    "comparisonObservable",
    "comparisonMethods",
    "comparisonFindings",
    "comparisonLimits",
  ] as const;
  return (
    <main
      className="content-panel study-comparison"
      data-testid="study-comparison"
    >
      <header className="overview-heading">
        <div className="eyebrow">FRA-02 · {comparison.question.id}</div>
        <h2>{t("comparisonTitle")}</h2>
        <p>{text(comparison.question.label, l)}</p>
        <p>{t("comparisonScope")}</p>
        <div className="notice">{t("comparisonNote")}</div>
        <div className="comparison-actions">
          <button className="primary" onClick={onOverview}>
            {t("backOverview")}
          </button>
          <button
            className="primary"
            onClick={() => onNode(comparison.question.id)}
          >
            {t("backAtlas")}
          </button>
          <a href={comparisonRecordUrl} target="_blank" rel="noreferrer">
            {t("comparisonRecord")} ↗
          </a>
        </div>
      </header>
      <aside
        className="comparison-synthesis"
        data-testid="comparison-synthesis"
      >
        <h3>{t("comparisonJudgments")}</h3>
        <p>{t("comparisonGuide")}</p>
        <a
          href={
            comparisonRecordUrl +
            "#6-cross-study-relationship-register--跨研究关系登记"
          }
          target="_blank"
          rel="noreferrer"
        >
          {t("comparisonNext")} ↗
        </a>
      </aside>
      {comparison.missing.length > 0 && (
        <p className="notice" role="status">
          {t("overviewMissing")} {comparison.missing.join(", ")}
        </p>
      )}
      <table className="comparison-table">
        <caption>
          {t("compareStudies")} · {comparison.studies.length} ·{" "}
          {t("overviewReportedFinding")}
        </caption>
        <thead>
          <tr>
            {columns.map((key) => (
              <th scope="col" key={key}>
                {t(key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparison.studies.map(
            ({
              source: s,
              observable,
              methods,
              evidenceType,
              findings,
              reviewFile,
            }) => (
              <tr key={s.id} data-testid={"comparison-study-" + s.id}>
                <th scope="row" data-label={t("comparisonStudy")}>
                  <h3>
                    {s.authors[0]} · {s.year}
                  </h3>
                  <p className="comparison-evidence-type">
                    {text(evidenceType, l)}
                  </p>
                  <div className="comparison-actions">
                    <button className="primary" onClick={() => onSource(s.id)}>
                      {t("comparisonEvidence")} ↗
                    </button>
                    <a href={s.url} target="_blank" rel="noreferrer">
                      DOI: {s.doi}
                    </a>
                    <a
                      href={
                        repository +
                        "/blob/4fabbf6d198e4870ca7fd86efbd64a29bfa09802/docs/literature/papers/" +
                        reviewFile
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("comparisonReview")} ↗
                    </a>
                  </div>
                  <details>
                    <summary>{t("sources")}</summary>
                    <p>{s.title}</p>
                    <p>
                      {t(s.sourceType)} · {t(s.readingScope)}
                    </p>
                    <div className="comparison-checks">
                      {(
                        [
                          "metadata",
                          "abstract",
                          "fullText",
                          "claim",
                          "independent",
                        ] as const
                      ).map((key) => (
                        <p key={key}>
                          {t(key)}: {t(s.verificationStatus[key])}
                        </p>
                      ))}
                    </div>
                  </details>
                  <p className="comparison-independent">
                    {t("independent")}: {t(s.verificationStatus.independent)}
                  </p>
                </th>
                <td data-label={t("comparisonConditions")}>
                  {text(s.researchConditions, l)}
                </td>
                <td data-label={t("comparisonObservable")}>
                  {text(observable, l)}
                </td>
                <td data-label={t("comparisonMethods")}>{text(methods, l)}</td>
                <td data-label={t("comparisonFindings")}>
                  {findings.map(({ finding: f, relatedNodes, citation }) => (
                    <details
                      className="comparison-finding"
                      key={f.id}
                      data-testid={"comparison-finding-" + f.id}
                    >
                      <summary>{text(f.statement, l)}</summary>
                      <p>
                        <code>{f.id}</code> · {t(f.scope)}
                      </p>
                      <p>
                        {t("locator")}: {text(f.locator, l)}
                      </p>
                      <p>
                        {t("conditions")}: {text(f.conditions, l)}
                      </p>
                      <p>
                        {t("limitations")}: {text(f.limitations, l)}
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
                          referencePrefix={"comparison-" + f.id + "-"}
                        />
                      )}
                    </details>
                  ))}
                </td>
                <td data-label={t("comparisonLimits")}>
                  {text(s.limitations, l)}
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </main>
  );
}
