"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { useApp } from "./AppContext";
import { Building, Business, Clock, Funnel, Sort, Check } from "./Icons";

interface ActiveRec {
  group: "active";
  title: string;
  meta: string;
  badge: string;
  badgeClass: string;
  bg: string;
  metaColor: string;
  progress?: number;
  footer: string;
  sortKey: number; // yyyymmdd
}
interface PastRec {
  group: "past";
  icon: React.ReactNode;
  title: string;
  sub: string;
  badge: string;
  badgeClass: string;
  sortKey: number;
}

const ACTIVE: ActiveRec[] = [
  { group: "active", title: "Business License", meta: "Lee's Corner Café · BL-2024-0073", badge: "Active", badgeClass: "bg", bg: "#ECFDF5", metaColor: "#047857", progress: 30, footer: "Expires Mar 14, 2025 · 4 months remaining", sortKey: 20250314 },
  { group: "active", title: "Building Permit", meta: "Residential addition · BP-2024-0841", badge: "In review", badgeClass: "br", bg: "#EFF6FF", metaColor: "#1D4ED8", footer: "Submitted Apr 28, 2024 · Under review", sortKey: 20240428 },
  { group: "active", title: "Sign Permit", meta: "Storefront sign · SP-2023-0301", badge: "Active", badgeClass: "bg", bg: "#ECFDF5", metaColor: "#047857", progress: 65, footer: "No expiry · Permanent installation", sortKey: 20231012 },
  { group: "active", title: "Dog License", meta: '"Biscuit" · DL-2024-1180', badge: "Active", badgeClass: "bg", bg: "#ECFDF5", metaColor: "#047857", progress: 20, footer: "Expires Jan 31, 2025 · 2 months remaining", sortKey: 20250131 },
];

const PAST: PastRec[] = [
  { group: "past", icon: <Clock stroke="var(--fg-3)" size={16} />, title: "Special Event Permit", sub: "Elm St Block Party · EP-2023-0412 · Aug 2, 2023", badge: "Expired", badgeClass: "bd", sortKey: 20230802 },
  { group: "past", icon: <Building stroke="var(--fg-3)" size={16} />, title: "Building Permit", sub: "Basement renovation · BP-2022-1190 · Nov 9, 2022", badge: "Completed", badgeClass: "bg", sortKey: 20221109 },
  { group: "past", icon: <Business stroke="var(--fg-3)" size={16} />, title: "Business License", sub: "Lee's Corner Café · BL-2023-0041 · Expired Mar 14, 2023", badge: "Expired", badgeClass: "bd", sortKey: 20230314 },
  { group: "past", icon: <Building stroke="var(--fg-3)" size={16} />, title: "Fence Permit", sub: "Rear yard fence · FN-2022-0455 · Jun 3, 2022", badge: "Completed", badgeClass: "bg", sortKey: 20220603 },
  { group: "past", icon: <Clock stroke="var(--fg-3)" size={16} />, title: "Special Event Permit", sub: "Street festival · EP-2021-0876 · Sep 18, 2021", badge: "Expired", badgeClass: "bd", sortKey: 20210918 },
];

type Filter = "all" | "active" | "past";

export default function RecordsView() {
  const { navKey } = useApp();
  const [filter, setFilter] = useState<Filter>("all");
  const [sortAsc, setSortAsc] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuWrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuOpen && menuWrap.current && !menuWrap.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [menuOpen]);

  const cmp = (a: { sortKey: number }, b: { sortKey: number }) => (sortAsc ? a.sortKey - b.sortKey : b.sortKey - a.sortKey);
  const active = useMemo(() => [...ACTIVE].sort(cmp), [sortAsc]);
  const past = useMemo(() => [...PAST].sort(cmp), [sortAsc]);

  const showActive = filter === "all" || filter === "active";
  const showPast = filter === "all" || filter === "past";

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "All records" },
    { key: "active", label: "Active only" },
    { key: "past", label: "Past & Expired" },
  ];

  return (
    <div id="records-container" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bg)", borderRadius: 10 }}>
      <div className="tbar">
        <span className="tbar-title">Records</span>
        <div className="tbar-right">
          {/* Filter */}
          <div ref={menuWrap} style={{ position: "relative" }}>
            <button
              className="ico-btn"
              onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
              title="Filter"
              style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #D1D5DB", color: filter === "all" ? "var(--fg-3)" : "#1D4ED8" }}
            >
              <Funnel stroke="currentColor" />
            </button>
            {menuOpen && (
              <div style={{ position: "absolute", top: 38, right: 0, width: 170, background: "#fff", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12),0 2px 6px rgba(0,0,0,0.06)", zIndex: 300, overflow: "hidden", padding: "4px 0", animation: "pageIn .2s cubic-bezier(.34,1.1,.64,1) both" }}>
                {filters.map((f) => (
                  <div
                    key={f.key}
                    onClick={() => { setFilter(f.key); setMenuOpen(false); }}
                    className="m3-body-small"
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px", color: "var(--fg)", cursor: "pointer", background: filter === f.key ? "var(--bg-2)" : "transparent" }}
                    onMouseOver={(e) => (e.currentTarget.style.background = "var(--bg-2)")}
                    onMouseOut={(e) => (e.currentTarget.style.background = filter === f.key ? "var(--bg-2)" : "transparent")}
                  >
                    {f.label}
                    {filter === f.key && (
                      <Check stroke="#1D4ED8" size={13} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Sort */}
          <button
            className="ico-btn"
            onClick={() => setSortAsc((s) => !s)}
            title={sortAsc ? "Sort: oldest first" : "Sort: newest first"}
            style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #D1D5DB", color: "var(--fg-3)" }}
          >
            <span style={{ display: "inline-flex", transform: sortAsc ? "scaleY(-1)" : "none", transition: "transform .2s" }}>
              <Sort stroke="currentColor" />
            </span>
          </button>
        </div>
      </div>

      <div style={{ overflowY: "auto", flex: 1, padding: "24px 28px" }} key={navKey + filter + String(sortAsc)} className="page-enter">
        {showActive && (
          <div style={{ marginBottom: 32 }}>
            <Header label="Active" count={String(active.length)} bg="#ECFDF5" color="#047857" />
            <div style={{ display: "flex", flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
              {active.map((r, i) => (
                <div key={i} style={{ background: r.bg, borderRadius: 10, padding: 18, width: 300, flexShrink: 0, cursor: "pointer", transition: "filter .15s" }} onMouseOver={(e) => (e.currentTarget.style.filter = "brightness(0.97)")} onMouseOut={(e) => (e.currentTarget.style.filter = "")}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <span className="m3-title-small" style={{ color: "var(--fg)" }}>{r.title}</span>
                    <span className={"badge " + r.badgeClass}>{r.badge}</span>
                  </div>
                  <div className="m3-body-small" style={{ color: r.metaColor, marginBottom: 10 }}>{r.meta}</div>
                  {r.progress !== undefined && (
                    <div style={{ height: 3, borderRadius: 2, background: "rgba(5,150,105,0.15)", overflow: "hidden", marginBottom: 6 }}>
                      <div style={{ width: `${r.progress}%`, height: "100%", borderRadius: 2, background: "#047857" }} />
                    </div>
                  )}
                  <div className="m3-body-small" style={{ color: r.metaColor }}>{r.footer}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showPast && (
          <div>
            {showActive && <div style={{ height: 1, background: "var(--line)", margin: "0 0 24px" }} />}
            <Header label="Past & Expired" count={String(past.length)} bg="var(--bg-3)" color="var(--fg-3)" />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {past.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: "#F3F4F6", borderRadius: 10, cursor: "pointer", opacity: 0.8, transition: "opacity .15s" }} onMouseOver={(e) => (e.currentTarget.style.opacity = "1")} onMouseOut={(e) => (e.currentTarget.style.opacity = "0.8")}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{p.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="m3-label-large" style={{ color: "var(--fg)" }}>{p.title}</div>
                    <div className="m3-body-small" style={{ color: "var(--fg-3)" }}>{p.sub}</div>
                  </div>
                  <span className={"badge " + p.badgeClass}>{p.badge}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Header({ label, count, bg, color }: { label: string; count: string; bg: string; color: string }) {
  return (
    <div className="m3-title-medium" style={{ color: "var(--fg)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
      {label}
      <span className="m3-label-small" style={{ background: bg, color, padding: "2px 8px", borderRadius: 20 }}>{count}</span>
    </div>
  );
}
