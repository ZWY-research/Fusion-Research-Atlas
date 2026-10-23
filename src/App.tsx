import {
  useCallback,
  useEffect,
  useRef,
  useState,
  lazy,
  Suspense,
} from "react";
import type { Core } from "cytoscape";
import {
  colors,
  kinds,
  epistemicStatuses,
  contentStatuses,
  parseAtlas,
  frameworkSchema,
  text,
  visibleNodes,
} from "./model";
import type { Atlas, Language } from "./model";
import frameworkData from "./content/framework.json";
import { ui, dual } from "./i18n";
import { CitationList, SourceDetail } from "./Evidence";
import { QuestionOverview } from "./QuestionOverview";
import { isOverviewNode, overviewQuestionId } from "./questionOverviewData";
import { contributionUrl, repository } from "./collaboration";
import "./App.css";
const Graph = lazy(() => import("./Graph"));
const framework = frameworkSchema.parse(frameworkData);
const panels = [
  "atlas",
  "about",
  "domains",
  "methodology",
  "evidence",
  "collaboration",
] as const;
type Panel = (typeof panels)[number] | "overview";
function locationPanel(): Panel {
  // Existing node/edge hashes take precedence, including links from other panels.
  if (hashId()) return "atlas";
  const view = new URL(location.href).searchParams.get("view");
  return view === "overview" || panels.some((p) => p === view)
    ? (view as Panel)
    : "atlas";
}
function hashId() {
  try {
    return decodeURIComponent(location.hash.slice(1));
  } catch {
    return "";
  }
}
function initialLanguage(): Language {
  try {
    return localStorage.getItem("fra-language") === "en" ? "en" : "zh";
  } catch {
    return "zh";
  }
}
export default function App() {
  const [language, setLanguage] = useState<Language>(initialLanguage),
    [panel, setPanel] = useState<Panel>(locationPanel),
    [overviewQuestion, setOverviewQuestion] = useState(
      () => new URL(location.href).searchParams.get("question") || "",
    ),
    [atlas, setAtlas] = useState<Atlas | null>(null),
    [error, setError] = useState(false),
    [loading, setLoading] = useState(true),
    [selected, setSelected] = useState(hashId),
    [sourceId, setSourceId] = useState(
      () => new URL(location.href).searchParams.get("source") || "",
    ),
    [query, setQuery] = useState(""),
    [kind, setKind] = useState("all"),
    [epistemic, setEpistemic] = useState("all"),
    [content, setContent] = useState("all"),
    [domain, setDomain] = useState("all");
  const cy = useRef<Core | null>(null),
    l = language;
  const t = (key: Parameters<typeof ui>[0]) => ui(key, l);
  const onReady = useCallback((core: Core | null) => {
    cy.current = core;
  }, []);
  const select = useCallback((id: string) => {
    setSelected(id);
    location.hash = encodeURIComponent(id);
  }, []);
  const syncLocation = useCallback(() => {
    const url = new URL(location.href);
    setPanel(locationPanel());
    setOverviewQuestion(url.searchParams.get("question") || "");
    setSourceId(url.searchParams.get("source") || "");
    setSelected(hashId());
  }, []);
  const navigate = useCallback(
    (
      next: Panel,
      options: { question?: string; node?: string; source?: string } = {},
    ) => {
      const url = new URL(location.href);
      if (next === "atlas") url.searchParams.delete("view");
      else url.searchParams.set("view", next);
      url.searchParams.delete("question");
      url.searchParams.delete("source");
      if (next === "overview")
        url.searchParams.set(
          "question",
          options.question || overviewQuestionId,
        );
      if (next === "evidence" && options.source)
        url.searchParams.set("source", options.source);
      if (next !== "atlas") url.hash = "";
      else if (options.node !== undefined)
        url.hash = options.node ? encodeURIComponent(options.node) : "";
      if (url.href !== location.href) history.pushState(null, "", url);
      syncLocation();
    },
    [syncLocation],
  );
  const openOverviewNode = (id: string) => {
    setQuery("");
    setKind("all");
    setEpistemic("all");
    setContent("all");
    setDomain("all");
    navigate("atlas", { node: id });
  };
  useEffect(() => {
    document.documentElement.lang = l === "zh" ? "zh-CN" : "en";
    try {
      localStorage.setItem("fra-language", l);
    } catch {}
  }, [l]);
  useEffect(() => {
    const controller = new AbortController();
    fetch(import.meta.env.BASE_URL + "data/electron-density.json", {
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw Error("Data HTTP " + r.status);
        return r.json();
      })
      .then((data) => {
        setAtlas(parseAtlas(data));
        setLoading(false);
      })
      .catch((e) => {
        if (e.name !== "AbortError") {
          setError(true);
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, []);
  useEffect(() => {
    window.addEventListener("hashchange", syncLocation);
    window.addEventListener("popstate", syncLocation);
    return () => {
      window.removeEventListener("hashchange", syncLocation);
      window.removeEventListener("popstate", syncLocation);
    };
  }, [syncLocation]);
  const visible = atlas
      ? visibleNodes(atlas, query, kind, epistemic, domain, content)
      : [],
    ids = visible.map((n) => n.id),
    node = atlas?.nodes.find((n) => n.id === selected),
    edge = atlas?.edges.find((e) => e.id === selected),
    relations =
      atlas?.edges.filter(
        (e) => e.source === selected || e.target === selected,
      ) || [],
    source = atlas?.sources.find((s) => s.id === sourceId);
  const reset = () => {
    setQuery("");
    setKind("all");
    setEpistemic("all");
    setContent("all");
    setDomain("all");
    select("");
  };
  const openSource = (id: string) => {
    navigate("evidence", { source: id });
  };
  const statusControl = (
    <>
      <label className="field">
        {t("epistemic")}
        <select
          aria-label={t("epistemic")}
          value={epistemic}
          onChange={(e) => setEpistemic(e.target.value)}
        >
          <option value="all">{t("all")}</option>
          {epistemicStatuses.map((s) => (
            <option key={s} value={s}>
              {t(s)}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        {t("content")}
        <select
          aria-label={t("content")}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        >
          <option value="all">{t("all")}</option>
          {contentStatuses.map((s) => (
            <option key={s} value={s}>
              {t(s)}
            </option>
          ))}
        </select>
      </label>
    </>
  );
  return (
    <div className="app">
      <header className="header">
        <a className="brand" href={import.meta.env.BASE_URL}>
          <span className="brand-symbol">⌘</span>
          <span>
            FUSION <strong>RESEARCH ATLAS</strong>
            <small>
              {l === "zh"
                ? "科学问题与研究进展"
                : "Scientific questions & research progress"}
            </small>
          </span>
        </a>
        <div className="header-right">
          <span className="version">V0.2 · {t("prototype")}</span>
          <div className="language-switch" aria-label="Language / 语言">
            <button aria-pressed={l === "zh"} onClick={() => setLanguage("zh")}>
              中文
            </button>
            <button aria-pressed={l === "en"} onClick={() => setLanguage("en")}>
              English
            </button>
          </div>
        </div>
      </header>
      <section className="intro">
        <div>
          <div className="eyebrow">QUESTIONS · MECHANISMS · EVIDENCE</div>
          <h1>
            {l === "zh"
              ? "从科学问题，到可检验的证据。"
              : "Connect scientific questions to testable evidence."}
          </h1>
          <p className="mission">
            {framework.mission.zh}
            <br />
            <span lang="en">{framework.mission.en}</span>
          </p>
        </div>
      </section>
      <div className="quick-map">
        <span>{t("focus")}</span>
        <button onClick={() => navigate("methodology")}>
          {t("structure")} ↗
        </button>
        <button onClick={() => navigate("evidence")}>{t("verify")} ↗</button>
        <button onClick={() => navigate("collaboration")}>
          {t("participate")} ↗
        </button>
      </div>
      <nav className="section-nav" aria-label="Research navigation / 科研导航">
        {panels.map((p) => (
          <button
            key={p}
            aria-current={panel === p ? "page" : undefined}
            className={panel === p ? "current" : ""}
            onClick={() => navigate(p)}
          >
            {dual(p)}
          </button>
        ))}
      </nav>
      {loading ? (
        <div className="state">{t("loading")}</div>
      ) : error ? (
        <div className="state" role="alert">
          {t("loadError")}
          <button onClick={() => location.reload()}>{t("retry")}</button>
        </div>
      ) : (
        atlas && (
          <>
            {panel === "overview" && (
              <QuestionOverview
                atlas={atlas}
                language={l}
                questionId={overviewQuestion}
                onNode={openOverviewNode}
                onSource={openSource}
              />
            )}
            {panel === "atlas" && (
              <>
                <div className="notice">◈ {text(atlas.disclaimer, l)}</div>
                <main className="workspace">
                  <aside className="sidebar">
                    <div className="panel-heading">
                      <h2>{t("atlas")}</h2>
                      <button onClick={reset}>{t("reset")}</button>
                    </div>
                    <label className="field">
                      {t("search")}
                      <input
                        aria-label={t("search")}
                        placeholder={t("query")}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                    </label>
                    <div className="filters">
                      <label className="field">
                        {t("domain")}
                        <select
                          aria-label={t("domain")}
                          value={domain}
                          onChange={(e) => setDomain(e.target.value)}
                        >
                          <option value="all">{t("all")}</option>
                          {framework.domains.map((d) => (
                            <option key={d.id} value={d.id}>
                              {text(d.name, l)}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="field">
                        {t("kind")}
                        <select
                          aria-label={t("kind")}
                          value={kind}
                          onChange={(e) => setKind(e.target.value)}
                        >
                          <option value="all">{t("all")}</option>
                          {kinds.map((k) => (
                            <option key={k} value={k}>
                              {k === "evidence"
                                ? l === "zh"
                                  ? "证据"
                                  : "Evidence"
                                : t(k)}
                            </option>
                          ))}
                        </select>
                      </label>
                      {statusControl}
                    </div>
                    <div className="list-title">
                      {t("objects")}{" "}
                      <span data-testid="result-count">{visible.length}</span>
                    </div>
                    <div className="node-list">
                      {visible.map((n) => (
                        <button
                          data-testid={"node-" + n.id}
                          key={n.id}
                          aria-pressed={selected === n.id}
                          className={
                            "node-item " + (selected === n.id ? "active" : "")
                          }
                          onClick={() => select(n.id)}
                        >
                          <i style={{ background: colors[n.kind] }} />
                          <span>
                            {text(n.label, l)}
                            <small>
                              {n.kind === "evidence"
                                ? l === "zh"
                                  ? "证据"
                                  : "Evidence"
                                : t(n.kind)}
                            </small>
                          </span>
                        </button>
                      ))}
                      {!visible.length && (
                        <p className="empty">{t("noResults")}</p>
                      )}
                    </div>
                  </aside>
                  <section className="graph-panel">
                    <div className="graph-top">
                      <span>
                        <i className="live-dot" />
                        {text(atlas.title, l)}
                      </span>
                      <span>
                        {
                          atlas.edges.filter(
                            (e) =>
                              ids.includes(e.source) && ids.includes(e.target),
                          ).length
                        }{" "}
                        {t("relationships")}
                      </span>
                    </div>
                    <Suspense
                      fallback={<div className="state">{t("loading")}</div>}
                    >
                      <Graph
                        atlas={atlas}
                        ids={ids}
                        selected={selected}
                        language={l}
                        onSelect={select}
                        onReady={onReady}
                      />
                    </Suspense>
                    <div className="graph-tools">
                      <button
                        aria-label={t("zoomIn")}
                        onClick={() =>
                          cy.current?.zoom(
                            Math.min(2.5, cy.current.zoom() * 1.2),
                          )
                        }
                      >
                        ＋
                      </button>
                      <button
                        aria-label={t("zoomOut")}
                        onClick={() =>
                          cy.current?.zoom(
                            Math.max(0.3, cy.current.zoom() / 1.2),
                          )
                        }
                      >
                        −
                      </button>
                      <button
                        onClick={() =>
                          cy.current?.fit(cy.current.elements(":visible"), 45)
                        }
                      >
                        {t("fit")}
                      </button>
                      <button onClick={() => select("")}>
                        {t("unselect")}
                      </button>
                    </div>
                    <div className="legend">
                      {kinds.map((k) => (
                        <span key={k}>
                          <i style={{ background: colors[k] }} />
                          {k === "evidence"
                            ? l === "zh"
                              ? "证据"
                              : "Evidence"
                            : t(k)}
                        </span>
                      ))}
                      <span>{t("legend")}</span>
                    </div>
                    <div className="graph-hint">{t("hint")}</div>
                  </section>
                  <aside className="detail" aria-live="polite">
                    {node ? (
                      <>
                        <div className="eyebrow">OBJECT / {node.id}</div>
                        <h2 data-testid="detail-title">
                          {text(node.label, l)}
                        </h2>
                        <div className="status">{t(node.epistemicStatus)}</div>
                        <div className="badge">{t(node.contentStatus)}</div>
                        {isOverviewNode(node.id) && (
                          <button
                            className="primary overview-entry"
                            onClick={() =>
                              navigate("overview", {
                                question: overviewQuestionId,
                              })
                            }
                          >
                            {t(
                              node.id === overviewQuestionId
                                ? "openOverview"
                                : "backOverview",
                            )}{" "}
                            →
                          </button>
                        )}
                        <p className="summary">{text(node.summary, l)}</p>
                        <h3>{t("context")}</h3>
                        <p>{text(node.details, l)}</p>
                        <div className="tags">
                          {node.tags.map((tag, i) => (
                            <span key={i}>{text(tag, l)}</span>
                          ))}
                        </div>
                        {!ids.includes(node.id) && (
                          <p>
                            {t("hidden")}
                            <button
                              onClick={() => {
                                setQuery("");
                                setKind("all");
                                setEpistemic("all");
                                setContent("all");
                                setDomain("all");
                              }}
                            >
                              {t("clear")}
                            </button>
                          </p>
                        )}
                        <h3>
                          {t("related")} ({relations.length})
                        </h3>
                        <div className="relations">
                          {relations.map((e) => (
                            <div className="relation" key={e.id}>
                              <button
                                data-testid={"edge-" + e.id}
                                onClick={() => select(e.id)}
                              >
                                {e.source === selected ? "→" : "←"}{" "}
                                {text(e.label, l)}
                              </button>
                              <small>
                                {text(
                                  atlas.nodes.find(
                                    (n) =>
                                      n.id ===
                                      (e.source === selected
                                        ? e.target
                                        : e.source),
                                  )!.label,
                                  l,
                                )}
                              </small>
                            </div>
                          ))}
                        </div>
                        <h3>{t("sources")}</h3>
                        <CitationList
                          citations={node.citations}
                          sources={atlas.sources}
                          language={l}
                          onSource={openSource}
                        />
                      </>
                    ) : edge ? (
                      <>
                        <div className="eyebrow">RELATION / {edge.id}</div>
                        <h2 data-testid="edge-title">{text(edge.label, l)}</h2>
                        <div className="status">{t(edge.epistemicStatus)}</div>
                        <div className="badge">{t(edge.contentStatus)}</div>
                        <h3>{t("direction")}</h3>
                        <div className="direction">
                          <button onClick={() => select(edge.source)}>
                            {text(
                              atlas.nodes.find((n) => n.id === edge.source)!
                                .label,
                              l,
                            )}
                          </button>
                          <span>→</span>
                          <button onClick={() => select(edge.target)}>
                            {text(
                              atlas.nodes.find((n) => n.id === edge.target)!
                                .label,
                              l,
                            )}
                          </button>
                        </div>
                        <h3>{t("meaning")}</h3>
                        <p>{text(edge.rationale, l)}</p>
                        <code>{edge.relation}</code>
                        <h3>{t("basis")}</h3>
                        <CitationList
                          citations={edge.citations}
                          sources={atlas.sources}
                          language={l}
                          onSource={openSource}
                        />
                        <p>{t("noCounter")}</p>
                      </>
                    ) : (
                      <div className="detail-empty">
                        <span>◎</span>
                        <h2>{t("select")}</h2>
                        <button onClick={() => select("q-density")}>
                          {t("start")} →
                        </button>
                        {selected && <p>{t("notFound")}</p>}
                      </div>
                    )}
                  </aside>
                </main>
              </>
            )}
            {panel === "about" && (
              <main className="content-panel">
                <div className="section-heading">
                  <span className="eyebrow">01 / PURPOSE</span>
                  <h2>{dual("about")}</h2>
                  <p>{text(framework.mission, l)}</p>
                </div>
                <div className="about-grid">
                  <section>
                    <h3>{l === "zh" ? "研究目标" : "Research goals"}</h3>
                    <ol className="goals">
                      {framework.goals.map((g, i) => (
                        <li key={i}>{text(g, l)}</li>
                      ))}
                    </ol>
                  </section>
                  <section>
                    <h3>{l === "zh" ? "科学立场" : "Scientific principles"}</h3>
                    {framework.principles.map((p, i) => (
                      <p key={i}>{text(p, l)}</p>
                    ))}
                    <div className="notice">{t("disclaimer")}</div>
                    <p>{t("focus")}</p>
                    <p>
                      {l === "zh"
                        ? "其他领域是未来研究范围，尚未完成正式子图谱。"
                        : "Other domains are future scope, with no completed dedicated subgraphs."}
                    </p>
                    <button
                      className="primary"
                      onClick={() => navigate("atlas")}
                    >
                      {t("atlas")} →
                    </button>
                  </section>
                </div>
              </main>
            )}
            {panel === "domains" && (
              <main className="content-panel">
                <div className="section-heading">
                  <span className="eyebrow">02 / SCIENTIFIC SCOPE</span>
                  <h2>{dual("domains")}</h2>
                  <p>
                    {l === "zh"
                      ? "领域、对象类型和认识状态独立；同一问题可关联多个领域。"
                      : "Domains, object types and epistemic states are independent; questions may span multiple domains."}
                  </p>
                </div>
                <div className="domain-grid">
                  {framework.domains.map((d) => (
                    <article
                      className="domain-card"
                      key={d.id}
                      data-testid={"domain-" + d.id}
                    >
                      <span
                        className={d.hasSubgraph ? "badge available" : "badge"}
                      >
                        {t(d.hasSubgraph ? "available" : "future")}
                      </span>
                      <h3>
                        {d.name.zh}
                        <small>{d.name.en}</small>
                      </h3>
                      <p>{text(d.scope, l)}</p>
                      <h4>{t("typical")}</h4>
                      <p>{text(d.questions[0], l)}</p>
                      {d.hasSubgraph && (
                        <button
                          className="primary"
                          onClick={() => {
                            setDomain(d.id);
                            navigate("atlas");
                          }}
                        >
                          {t("explore")} →
                        </button>
                      )}
                    </article>
                  ))}
                </div>
              </main>
            )}
            {panel === "methodology" && (
              <main className="content-panel">
                <div className="section-heading">
                  <span className="eyebrow">03 / RESEARCH LOGIC</span>
                  <h2>{dual("methodology")}</h2>
                  <p>
                    {l === "zh"
                      ? "从现象到可区分的预测，以实际证据修订认识。流程帮助研究，不替代物理判断。"
                      : "From phenomena to distinguishable predictions, revise understanding through actual evidence. A workflow supports research; it does not replace physical judgment."}
                  </p>
                </div>
                <div className="method-grid">
                  {framework.methodology.map((s, i) => (
                    <article className="method-card" key={s.id}>
                      <span className="step-number">0{i + 1}</span>
                      <h3>
                        {s.name.zh}
                        <small>{s.name.en}</small>
                      </h3>
                      <p>{text(s.action, l)}</p>
                      <dl>
                        <dt>{t("input")}</dt>
                        <dd>{text(s.input, l)}</dd>
                        <dt>{t("output")}</dt>
                        <dd>{text(s.output, l)}</dd>
                        <dt>{t("update")}</dt>
                        <dd>{text(s.update, l)}</dd>
                      </dl>
                    </article>
                  ))}
                </div>
                <div className="principle-row">
                  {framework.principles.map((p, i) => (
                    <span key={i}>{text(p, l)}</span>
                  ))}
                </div>
              </main>
            )}
            {panel === "evidence" && (
              <main className="content-panel">
                <div className="section-heading">
                  <span className="eyebrow">04 / PROVENANCE</span>
                  <h2>{dual("evidence")}</h2>
                  <p>{t("evidenceWarning")}</p>
                  <button
                    className="primary"
                    onClick={() =>
                      navigate("overview", { question: overviewQuestionId })
                    }
                  >
                    {t("backOverview")}
                  </button>
                </div>
                <div className="evidence-layout">
                  <aside className="evidence-sidebar">
                    <h3>
                      {t("sources")} ({atlas.sources.length})
                    </h3>
                    {atlas.sources.map((s) => (
                      <button
                        key={s.id}
                        className={sourceId === s.id ? "selected-paper" : ""}
                        onClick={() => openSource(s.id)}
                      >
                        {s.year} · {s.title}
                      </button>
                    ))}
                    <h3>{t("standards")}</h3>
                    <p>
                      {l === "zh"
                        ? "分别核对书目、摘要/全文、具体主张及独立验证。检查物理条件、模型假设、不确定度和相反证据。"
                        : "Check metadata, abstract/full text, specific claims and independent validation separately. Assess physical conditions, model assumptions, uncertainty and counterevidence."}
                    </p>
                    <p>
                      {l === "zh"
                        ? "网站使用离线核验记录，不依赖实时 DOI 查询。"
                        : "The site uses offline verification records; live DOI services are not required."}
                    </p>
                  </aside>
                  <section className="evidence-records">
                    {(source ? [source] : atlas.sources).map((s) => (
                      <SourceDetail key={s.id} source={s} language={l} />
                    ))}
                  </section>
                </div>
              </main>
            )}
            {panel === "collaboration" && (
              <main className="content-panel">
                <div className="section-heading">
                  <span className="eyebrow">
                    05 / INTERNATIONAL PARTICIPATION
                  </span>
                  <h2>{dual("collaboration")}</h2>
                  <p>
                    {l === "zh"
                      ? "欢迎研究人员以中文或英文参与。请提交清晰问题、可追溯来源和具体物理适用范围。"
                      : "Researchers are welcome to contribute in English or Chinese. Submit clear questions, traceable sources and specific physical conditions."}
                  </p>
                </div>
                <div className="collaboration-grid">
                  {framework.participation.map((p) => (
                    <article className="domain-card" key={p.id}>
                      <h3>
                        {p.name.zh}
                        <small>{p.name.en}</small>
                      </h3>
                      <p>{text(p.description, l)}</p>
                      <a
                        data-testid={"contribute-" + p.id}
                        className="primary"
                        href={contributionUrl(p.id)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t("contribute")} ↗
                      </a>
                    </article>
                  ))}
                </div>
                <p className="collab-note">{t("collabNote")}</p>
                <a href={repository} target="_blank" rel="noreferrer">
                  {t("github")} ↗
                </a>
              </main>
            )}
          </>
        )
      )}
      <footer>
        <span>FUSION RESEARCH ATLAS · V0.2</span>
        <span>{t("disclaimer")}</span>
      </footer>
    </div>
  );
}
