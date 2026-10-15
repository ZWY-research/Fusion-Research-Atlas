import type { Language } from "./model";
import type { natureReferences } from "./citations";
export function References({
  entries,
  language,
  error,
}: {
  entries: ReturnType<typeof natureReferences>;
  language: Language;
  error: string;
}) {
  if (error) return <p role="alert">{error}</p>;
  if (!entries.length) return null;
  return (
    <section
      className="references"
      aria-label={language === "zh" ? "参考文献" : "References"}
    >
      <h3>{language === "zh" ? "参考文献 / References" : "References"}</h3>
      {entries.map((entry) => (
        <div
          className="reference-entry"
          key={entry.sourceId}
          id={"ref-" + entry.sourceId}
          data-source-id={entry.sourceId}
        >
          <div dangerouslySetInnerHTML={{ __html: entry.html }} />
          <a
            className="reference-link"
            href={entry.url}
            target="_blank"
            rel="noreferrer"
          >
            {entry.url} ↗
          </a>
        </div>
      ))}
      <small className="citation-attribution">
        Nature ·{" "}
        <a href="https://citationstyles.org/" target="_blank" rel="noreferrer">
          CSL
        </a>{" "}
        ·{" "}
        <a
          href="https://github.com/Juris-M/citeproc-js"
          target="_blank"
          rel="noreferrer"
        >
          citeproc-js, © Frank Bennett
        </a>
      </small>
    </section>
  );
}
