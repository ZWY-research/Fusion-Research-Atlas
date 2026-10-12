import { text } from "./model";
import type { Source, Citation, Language } from "./model";
import { ui } from "./i18n";
// Pin the studied documents so links work while the research PR is still open.
const studyRevision = "5007325d549eef8e6a5681b26f6ee647cb5bb8f9";
const studyVersions: Record<string, string> = {
  "paper-mordijck-2020": "74bd06f48ec06a67a15464d0f6a4200a72096d0f",
};
const studyPages: Record<string, string> = {
  "paper-angioni-2003": "angioni-2003.md",
  "paper-angioni-2007": "angioni-2007.md",
  "paper-greenwald-2007": "greenwald-2007.md",
  "paper-mordijck-2020": "mordijck-2020.md",
};
export function SourceDetail({
  source: s,
  language: l,
}: {
  source: Source;
  language: Language;
}) {
  return (
    <article className="paper" data-testid={"paper-" + s.id}>
      <div className="eyebrow">
        {ui(s.sourceType, l)} · {s.year} · {ui(s.readingScope, l)} ·{" "}
        {ui(s.contentStatus, l)}
      </div>
      <h3>{s.title}</h3>
      {l === "zh" && <p>{s.titleTranslation.zh}</p>}
      <p className="bibliography">
        {s.authors.join(", ")}
        {s.collectiveAuthors.length
          ? " · " + s.collectiveAuthors.join("; ")
          : ""}
        <br />
        {s.journal} {s.volume} ({s.issue}), {s.pages} ({s.year})
      </p>
      <a className="doi-link" href={s.url} target="_blank" rel="noreferrer">
        {s.doi ? "DOI: " + s.doi : ui("unknownDoi", l)} ↗
      </a>
      {studyPages[s.id] && (
        <a
          className="provider"
          data-testid={"insight-" + s.id}
          href={
            "https://github.com/ZWY-research/Fusion-Research-Atlas/blob/" +
            (studyVersions[s.id] || studyRevision) +
            "/docs/literature/papers/" +
            studyPages[s.id]
          }
          target="_blank"
          rel="noreferrer"
        >
          {l === "zh" ? "科研成果解读" : "Research Insights"} ↗
        </a>
      )}
      <div className="verification-grid">
        {(
          ["metadata", "abstract", "fullText", "claim", "independent"] as const
        ).map((k) => (
          <span key={k} className={s.verificationStatus[k]}>
            {ui(k, l)}: {ui(s.verificationStatus[k], l)}
          </span>
        ))}
      </div>
      <p className="date">
        {ui("verifiedAt", l)}: {s.verifiedAt || "—"}
      </p>
      <h4>{ui("conditions", l)}</h4>
      <p>{text(s.researchConditions, l)}</p>
      <h4>{ui("findings", l)}</h4>
      {s.reportedFindings.map((f) => (
        <div className="finding" key={f.id} data-testid={"finding-" + f.id}>
          <p>{text(f.statement, l)}</p>
          <small>
            {f.id} · {ui("locator", l)}: {text(f.locator, l)} · {ui(f.scope, l)}
          </small>
        </div>
      ))}
      <h4>{ui("limitations", l)}</h4>
      <p>{text(s.limitations, l)}</p>
      <details>
        <summary>{ui("sources", l)}</summary>
        {s.metadataSources.map((url) => (
          <a
            className="provider"
            href={url}
            key={url}
            target="_blank"
            rel="noreferrer"
          >
            {new URL(url).hostname} ↗
          </a>
        ))}
      </details>
    </article>
  );
}
export function CitationList({
  citations,
  sources,
  language: l,
  onSource,
}: {
  citations: Citation[];
  sources: Source[];
  language: Language;
  onSource: (id: string) => void;
}) {
  return (
    <>
      {!citations.length ? (
        <p className="source">{ui("noSources", l)}</p>
      ) : (
        citations.map((c, i) => {
          const s = sources.find((s) => s.id === c.sourceId)!;
          return (
            <div className="citation" key={c.sourceId + "-" + i}>
              <span className="badge">
                {c.role === "context" ? ui("reference", l) : ui(c.role, l)} ·{" "}
                {ui(c.scope, l)}
              </span>
              <button onClick={() => onSource(s.id)}>{s.title} ↗</button>
              <a
                className="doi-link"
                href={s.url}
                target="_blank"
                rel="noreferrer"
              >
                {s.doi || ui("unknownDoi", l)}
              </a>
              <p>{text(c.statement, l)}</p>
              <small>
                {c.findingId && (
                  <>
                    <code>{c.findingId}</code>
                    <br />
                  </>
                )}
                {ui("conditions", l)}: {text(c.conditions, l)}
                <br />
                {ui("locator", l)}: {text(c.locator, l)}
              </small>
              <div className="verification-line">
                {ui("metadata", l)}: {ui(s.verificationStatus.metadata, l)} ·{" "}
                {c.claimVerified ? ui("checked", l) : ui("notVerified", l)}
              </div>
            </div>
          );
        })
      )}
    </>
  );
}
