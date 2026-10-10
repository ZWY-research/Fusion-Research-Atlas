import { useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import type { Core } from "cytoscape";
import { colors, text } from "./model";
import type { Atlas, Language } from "./model";
export default function Graph({
  atlas,
  ids,
  selected,
  onSelect,
  onReady,
  language,
}: {
  atlas: Atlas;
  ids: string[];
  selected: string;
  onSelect: (id: string) => void;
  onReady: (cy: Core | null) => void;
  language: Language;
}) {
  const initialLanguage = useRef(language);
  const container = useRef<HTMLDivElement>(null),
    cyRef = useRef<Core | null>(null);
  useEffect(() => {
    const cy = cytoscape({
      container: container.current,
      elements: [
        ...atlas.nodes.map((n) => ({
          data: {
            id: n.id,
            label: text(n.label, initialLanguage.current),
            kind: n.kind,
            color: colors[n.kind],
          },
          position: n.position,
        })),
        ...atlas.edges.map((e) => ({
          data: { ...e, label: text(e.label, initialLanguage.current) },
        })),
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
          selector: 'edge[epistemicStatus="candidate_hypothesis"]',
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
    cy.on("tap", "edge", (e) => onSelect(e.target.id()));
    cyRef.current = cy;
    onReady(cy);
    const observer = new ResizeObserver(() => {
      cy.resize();
    });
    observer.observe(container.current!);
    cy.fit(undefined, 45);
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
    cy.batch(() => {
      for (const n of atlas.nodes)
        cy.getElementById(n.id).data("label", text(n.label, language));
      for (const e of atlas.edges)
        cy.getElementById(e.id).data("label", text(e.label, language));
    });
  }, [language, atlas]);
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
    const selectedEdge = atlas.edges.find((e) => e.id === selected);
    if (
      selectedEdge &&
      allowed.has(selectedEdge.source) &&
      allowed.has(selectedEdge.target)
    ) {
      const e = cy.getElementById(selected);
      cy.elements(":visible").addClass("dim");
      e.removeClass("dim").addClass("focus");
      e.connectedNodes().removeClass("dim").addClass("focus");
    } else if (selected && allowed.has(selected)) {
      const n = cy.getElementById(selected);
      cy.elements(":visible").addClass("dim");
      n.closedNeighborhood().filter(":visible").removeClass("dim");
      n.addClass("focus");
      n.connectedEdges().filter(":visible").addClass("focus");
    }
  }, [ids, selected, atlas]);
  return (
    <div
      ref={container}
      className="graph"
      role="img"
      aria-label={
        language === "zh"
          ? "交互式科学关系图，可使用节点和关系列表浏览"
          : "Interactive scientific graph; node and relationship lists are also available"
      }
      data-testid="graph"
    />
  );
}
