import { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
import type { Core } from "cytoscape";
import {
  atlasSchema,
  colors,
  kinds,
  kindLabels,
  statuses,
  statusLabels,
  visibleNodes,
} from "./model";
import type { Atlas } from "./model";
import "./App.css";

function Graph({
  atlas,
  ids,
  selected,
  onSelect,
  onReady,
}: {
  atlas: Atlas;
  ids: string[];
  selected: string;
  onSelect: (id: string) => void;
  onReady: (cy: Core | null) => void;
}) {
  const container = useRef<HTMLDivElement>(null),
    cyRef = useRef<Core | null>(null);
  useEffect(() => {
    const cy = cytoscape({
      container: container.current,
      elements: [
        ...atlas.nodes.map((n) => ({
          data: {
            id: n.id,
            label: n.label,
            kind: n.kind,
            color: colors[n.kind],
          },
          position: n.position,
        })),
        ...atlas.edges.map((e) => ({ data: { ...e } })),
      ],
      layout: { name: "preset" },
      minZoom: 0.3,
      maxZoom: 2.5,
      style: [
        {
          selector: "node",
          style: {
            "background-color": "data(color)",
            label: "data(label)",
            color: "#dce4f5",
            "font-size": 18,
            "text-wrap": "wrap",
            "text-max-width": "155px",
            "text-valign": "bottom",
            "text-margin-y": 12,
            width: 26,
            height: 26,
            "border-width": 5,
            "border-color": "data(color)",
            "border-opacity": 0.16,
          },
        },
        {
          selector: 'node[kind="question"]',
          style: {
            width: 48,
            height: 48,
            "font-size": 22,
            "font-weight": "bold",
          },
        },
        {
          selector: "edge",
          style: {
            width: 1.4,
            "line-color": "#44506a",
            "target-arrow-color": "#44506a",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            label: "data(label)",
            "font-size": 12,
            color: "#8997b1",
            "text-rotation": "autorotate",
            "text-background-color": "#111a2a",
            "text-background-opacity": 0.9,
            "text-background-padding": "3px",
          },
        },
        {
          selector: 'edge[status="hypothesis"]',
          style: {
            "line-style": "dashed",
            "line-color": "#9377c1",
            "target-arrow-color": "#9377c1",
          },
        },
        { selector: ".dim", style: { opacity: 0.12 } },
        {
          selector: ".focus",
          style: { "border-width": 8, "border-opacity": 0.6 },
        },
        {
          selector: "edge.focus",
          style: {
            width: 3,
            "line-color": "#91adff",
            "target-arrow-color": "#91adff",
            color: "#dbe5ff",
          },
        },
        { selector: ".hidden", style: { display: "none" } },
      ],
    });
    cy.on("tap", "node", (e) => onSelect(e.target.id()));
    cyRef.current = cy;
    onReady(cy);
    const observer = new ResizeObserver(() => {
      cy.resize();
    });
    observer.observe(container.current!);
    cy.fit(undefined, 70);
    return () => {
      observer.disconnect();
      onReady(null);
      cy.destroy();
      cyRef.current = null;
    };
  }, [atlas, onSelect, onReady]);
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.elements().removeClass("hidden dim focus");
    const allowed = new Set(ids);
    cy.nodes().forEach((n) => {
      if (!allowed.has(n.id())) n.addClass("hidden");
    });
    cy.edges().forEach((e) => {
      if (!allowed.has(e.source().id()) || !allowed.has(e.target().id()))
        e.addClass("hidden");
    });
    if (selected && allowed.has(selected)) {
      const n = cy.getElementById(selected);
      cy.elements(":visible").addClass("dim");
      n.closedNeighborhood().filter(":visible").removeClass("dim");
      n.addClass("focus");
      n.connectedEdges().filter(":visible").addClass("focus");
    }
  }, [ids, selected]);
  return (
    <div
      ref={container}
      className="graph"
      role="img"
      aria-label="交互式科学关系图，亦可使用左侧节点列表浏览"
      data-testid="graph"
    />
  );
}
import { useCallback } from "react";
export default function App() {
  const [atlas, setAtlas] = useState<Atlas | null>(null),
    [error, setError] = useState(""),
    [query, setQuery] = useState(""),
    [kind, setKind] = useState("all"),
    [status, setStatus] = useState("all"),
    [selected, setSelected] = useState(() =>
      decodeURIComponent(location.hash.slice(1)),
    ),
    [loading, setLoading] = useState(true);
  const cy = useRef<Core | null>(null);
  const onReady = useCallback((core: Core | null) => {
    cy.current = core;
  }, []);
  const select = useCallback((id: string) => {
    setSelected(id);
    location.hash = encodeURIComponent(id);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    fetch(import.meta.env.BASE_URL + "data/electron-density.json", {
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw Error("图谱文件加载失败 (" + r.status + ")");
        return r.json();
      })
      .then((data) => {
        setAtlas(atlasSchema.parse(data));
        setLoading(false);
      })
      .catch((e) => {
        if (e.name !== "AbortError") {
          setError("无法加载图谱，请检查数据文件或网络。");
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, []);
  useEffect(() => {
    const update = () => {
      try {
        setSelected(decodeURIComponent(location.hash.slice(1)));
      } catch {
        setSelected("");
      }
    };
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  const visible = atlas ? visibleNodes(atlas, query, kind, status) : [],
    ids = visible.map((n) => n.id);
  const node = atlas?.nodes.find((n) => n.id === selected),
    relations =
      atlas?.edges.filter(
        (e) => e.source === selected || e.target === selected,
      ) || [];
  const reset = () => {
    setQuery("");
    setKind("all");
    setStatus("all");
    select("");
  };
  return (
    <div className="app">
      <header className="header">
        <a className="brand" href={import.meta.env.BASE_URL}>
          <span className="brand-symbol">⌘</span>
          <span>
            FUSION <strong>RESEARCH ATLAS</strong>
            <small>科学问题与证据图谱</small>
          </span>
        </a>
        <span className="version">V0.1 · 本地研究原型</span>
      </header>
      <section className="intro">
        <div>
          <div className="eyebrow">EXPLORE THE CONNECTIONS</div>
          <h1>从科学问题，到可检验的证据。</h1>
          <p>
            电子密度输运与密度峰化 <span className="separator">/</span>{" "}
            研究子图谱 001
          </p>
        </div>
        <div className="intro-stat">
          <strong>{atlas?.nodes.length ?? "—"}</strong> 个科学对象{" "}
          <span>·</span> <strong>{atlas?.edges.length ?? "—"}</strong> 条关系
        </div>
      </section>
      <div className="notice">
        <span>◈</span>{" "}
        示例研究框架：不包含实验测量结果。虚线表示待验证假设；连线不代表已证实的因果关系。
      </div>
      {loading ? (
        <div className="state">正在加载图谱…</div>
      ) : error ? (
        <div className="state" role="alert">
          {error}
          <button onClick={() => location.reload()}>重新加载</button>
        </div>
      ) : (
        atlas && (
          <main className="workspace">
            <aside className="sidebar">
              <div className="panel-heading">
                <h2>探索图谱</h2>
                <button onClick={reset}>重置</button>
              </div>
              <label className="field">
                搜索科学对象
                <input
                  aria-label="搜索科学对象"
                  placeholder="名称、机制或关键词…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              <div className="filters">
                <label className="field">
                  对象类型
                  <select
                    aria-label="对象类型"
                    value={kind}
                    onChange={(e) => setKind(e.target.value)}
                  >
                    <option value="all">全部类型</option>
                    {kinds.map((k) => (
                      <option key={k} value={k}>
                        {kindLabels[k]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  证据状态
                  <select
                    aria-label="证据状态"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="all">全部状态</option>
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {statusLabels[s]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="list-title">
                科学对象{" "}
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
                      {n.label}
                      <small>{kindLabels[n.kind]}</small>
                    </span>
                    <span className="chevron">›</span>
                  </button>
                ))}
                {!visible.length && (
                  <p className="empty">没有匹配对象。请调整搜索或筛选。</p>
                )}
              </div>
            </aside>
            <section className="graph-panel">
              <div className="graph-top">
                <span>
                  <i className="live-dot" />
                  电子密度 · 证据网络
                </span>
                <span data-testid="visible-edges">
                  {
                    atlas.edges.filter(
                      (e) => ids.includes(e.source) && ids.includes(e.target),
                    ).length
                  }{" "}
                  条可见关系
                </span>
              </div>
              <Graph
                atlas={atlas}
                ids={ids}
                selected={selected}
                onSelect={select}
                onReady={onReady}
              />
              <div className="graph-tools">
                <button
                  aria-label="放大图谱"
                  onClick={() =>
                    cy.current?.zoom(Math.min(2.5, cy.current.zoom() * 1.2))
                  }
                >
                  ＋
                </button>
                <button
                  aria-label="缩小图谱"
                  onClick={() =>
                    cy.current?.zoom(Math.max(0.3, cy.current.zoom() / 1.2))
                  }
                >
                  −
                </button>
                <button
                  onClick={() =>
                    cy.current?.fit(cy.current.elements(":visible"), 60)
                  }
                >
                  适应视图
                </button>
                <button onClick={() => select("")}>取消高亮</button>
              </div>
              <div className="legend">
                {kinds.map((k) => (
                  <span key={k}>
                    <i style={{ background: colors[k] }} />
                    {kindLabels[k]}
                  </span>
                ))}
                <span>┄ 待验证关系</span>
              </div>
              <div className="graph-hint">
                拖动节点 · 滚轮缩放 · 点击查看关联
              </div>
            </section>
            <aside className="detail" aria-live="polite">
              {node ? (
                <>
                  <div className="eyebrow">
                    OBJECT / {node.id.toUpperCase()}
                  </div>
                  <span
                    className="type-pill"
                    style={{ color: colors[node.kind] }}
                  >
                    {kindLabels[node.kind]}
                  </span>
                  <h2 data-testid="detail-title">{node.label}</h2>
                  <div className="status">{statusLabels[node.status]}</div>
                  <p className="summary">{node.summary}</p>
                  <h3>科学语境</h3>
                  <p>{node.details}</p>
                  <div className="tags">
                    {node.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  {!ids.includes(node.id) && (
                    <p className="filter-note">
                      该对象已被当前筛选隐藏。
                      <button
                        onClick={() => {
                          setQuery("");
                          setKind("all");
                          setStatus("all");
                        }}
                      >
                        清除筛选
                      </button>
                    </p>
                  )}
                  <h3>
                    关联关系 <span>{relations.length}</span>
                  </h3>
                  <div className="relations">
                    {relations.map((e) => {
                      const other = atlas.nodes.find(
                        (n) =>
                          n.id ===
                          (e.source === selected ? e.target : e.source),
                      )!;
                      return (
                        <div className="relation" key={e.id}>
                          <small>
                            {e.source === selected ? "→" : "←"} {e.label} ·{" "}
                            {statusLabels[e.status]}
                          </small>
                          <button onClick={() => select(other.id)}>
                            {other.label} ↗
                          </button>
                          <p>{e.rationale}</p>
                        </div>
                      );
                    })}
                  </div>
                  <h3>证据与来源</h3>
                  {node.sourceIds.length ? (
                    node.sourceIds.map((id) => {
                      const s = atlas.sources.find((s) => s.id === id)!;
                      return (
                        <div className="source" key={id}>
                          <a href={s.url} target="_blank" rel="noreferrer">
                            {s.title} ↗
                          </a>
                          <p>{s.scope}</p>
                        </div>
                      );
                    })
                  ) : (
                    <div className="source">
                      无已核验文献或实验数据。此对象仅用于演示研究组织与验证路径，不能作为论文结论引用。
                    </div>
                  )}
                </>
              ) : (
                <div className="detail-empty">
                  <span>◎</span>
                  <h2>沿着关系，探索问题。</h2>
                  <p>点击图谱中的节点，查看科学语境、关联假设与证据状态。</p>
                  <button onClick={() => select("q-density")}>
                    从核心问题开始 →
                  </button>
                  {selected && <p>未找到链接中的节点。</p>}
                </div>
              )}
            </aside>
          </main>
        )
      )}
      <footer>
        <span>FUSION RESEARCH ATLAS</span>
        <span>公开示例数据 · 证据透明 · 可持续扩展</span>
      </footer>
    </div>
  );
}
