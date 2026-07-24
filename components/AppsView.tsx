"use client";

import React, { useEffect, useState } from "react";
import { useApp, APP_DATA, AppRecord } from "./AppContext";
import { Plus, Search, Dots } from "./Icons";
import AppDetail from "./AppDetail";

type LaneKey = "draft" | "inprogress" | "completed";

interface KCard {
  ref: string;
  title: string;
  badge: string;
  badgeClass: string;
  // status-style card
  bg?: string;
  hover?: string;
  meta?: string;
  metaColor?: string;
  // draft-style card
  isDraft?: boolean;
  progress?: number;
  missing?: string;
}

const INITIAL: Record<LaneKey, KCard[]> = {
  draft: [
    {
      ref: "VP-2024-0052",
      title: "Food truck — King St West",
      badge: "Draft",
      badgeClass: "bd",
      isDraft: true,
      meta: "Vendor permit · VP-2024-0052 · Last edited May 1",
      progress: 40,
      missing: "Missing: insurance, health inspection",
    },
    {
      ref: "DK-2024-0088",
      title: "Backyard deck — 12 Birch Rd",
      badge: "Draft",
      badgeClass: "bd",
      isDraft: true,
      meta: "Building permit · DK-2024-0088 · Last edited May 5",
      progress: 70,
      missing: "Missing: structural drawings",
    },
  ],
  inprogress: [
    { ref: "BP-2024-0841", title: "Residential addition", badge: "In review", badgeClass: "br", bg: "#EFF6FF", hover: "#DBEAFE", meta: "Building permit · Submitted Apr 28", metaColor: "#1D4ED8" },
    { ref: "EP-2024-0219", title: "Summer block party", badge: "Info needed", badgeClass: "bp", bg: "#FFFBEB", hover: "#FEF3C7", meta: "Event permit · Submitted Apr 22", metaColor: "var(--amber)" },
    { ref: "BP-2024-0912", title: "Basement apartment", badge: "In review", badgeClass: "br", bg: "#EFF6FF", hover: "#DBEAFE", meta: "Building permit · Submitted May 6", metaColor: "#1D4ED8" },
    { ref: "EP-2024-0301", title: "Farmers market — Dundas Sq", badge: "Info needed", badgeClass: "bp", bg: "#FFFBEB", hover: "#FEF3C7", meta: "Event permit · Submitted May 2", metaColor: "var(--amber)" },
  ],
  completed: [
    { ref: "BL-2024-0073", title: "Lee's Corner Café", badge: "Approved", badgeClass: "bg", bg: "#ECFDF5", hover: "#D1FAE5", meta: "Business license · Mar 14, 2024", metaColor: "var(--green)" },
    { ref: "SP-2023-0301", title: "Storefront sign — Lee's Café", badge: "Approved", badgeClass: "bg", bg: "#ECFDF5", hover: "#D1FAE5", meta: "Sign permit · Oct 12, 2023", metaColor: "var(--green)" },
  ],
};

// Consistent application stage (of 4) per status: Submitted → Completeness → Review → Decision
const PROGRESS: Record<string, number> = { bd: 1, bp: 2, br: 3, bg: 4 };

const LANES: { key: LaneKey; label: string; countBg: string; countColor: string; laneBg: string }[] = [
  { key: "draft", label: "Draft", countBg: "var(--bg-3)", countColor: "var(--fg-3)", laneBg: "#F4F5F7" },
  { key: "inprogress", label: "In progress", countBg: "var(--bg-3)", countColor: "var(--fg-3)", laneBg: "#F4F7FD" },
  { key: "completed", label: "Completed", countBg: "var(--green-s)", countColor: "var(--green)", laneBg: "#F1FAF5" },
];

// Card fill/hover/accent colors, matching the palette used for the seeded
// in-progress and completed cards, keyed by badge class.
const BADGE_COLORS: Record<string, { bg: string; hover: string; metaColor: string }> = {
  br: { bg: "#EFF6FF", hover: "#DBEAFE", metaColor: "#1D4ED8" },
  bp: { bg: "#FFFBEB", hover: "#FEF3C7", metaColor: "var(--amber)" },
  bg: { bg: "#ECFDF5", hover: "#D1FAE5", metaColor: "var(--green)" },
};

function laneForStatus(app: AppRecord): LaneKey {
  if (app.status === "draft") return "draft";
  if (app.status === "approved") return "completed";
  return "inprogress";
}

function cardFromApp(app: AppRecord): KCard {
  const colors = BADGE_COLORS[app.badgeClass] ?? BADGE_COLORS.br;
  return {
    ref: app.ref,
    title: app.title,
    badge: app.badge,
    badgeClass: app.badgeClass,
    bg: colors.bg,
    hover: colors.hover,
    meta: `${app.type} · Submitted ${app.submitted}`,
    metaColor: colors.metaColor,
  };
}

export default function AppsView() {
  const { openChat, openAppDetail, detailRef, navKey, newAppRefs } = useApp();
  const [board, setBoard] = useState<Record<LaneKey, KCard[]>>(INITIAL);
  const [drag, setDrag] = useState<{ from: LaneKey; ref: string } | null>(null);
  const [over, setOver] = useState<LaneKey | null>(null);
  const [menuLane, setMenuLane] = useState<LaneKey | null>(null);

  // Pick up applications submitted through the wizard — they live in
  // APP_DATA but the board's own state is a static snapshot, so newly
  // created refs need to be merged in explicitly as they appear.
  useEffect(() => {
    if (newAppRefs.length === 0) return;
    setBoard((b) => {
      const existing = new Set(Object.values(b).flat().map((c) => c.ref));
      const additions = newAppRefs.filter((ref) => !existing.has(ref) && APP_DATA[ref]);
      if (additions.length === 0) return b;
      const next = { ...b };
      for (const ref of additions) {
        const app = APP_DATA[ref];
        const lane = laneForStatus(app);
        next[lane] = [cardFromApp(app), ...next[lane]];
      }
      return next;
    });
  }, [newAppRefs]);

  if (detailRef) {
    return (
      <div id="apps-container" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bg)", borderRadius: 10 }}>
        <AppDetail />
      </div>
    );
  }

  const drop = (to: LaneKey) => {
    setOver(null);
    if (!drag || drag.from === to) return setDrag(null);
    setBoard((b) => {
      const card = b[drag.from].find((c) => c.ref === drag.ref);
      if (!card) return b;
      return {
        ...b,
        [drag.from]: b[drag.from].filter((c) => c.ref !== drag.ref),
        [to]: [...b[to], card],
      };
    });
    setDrag(null);
  };

  return (
    <div id="apps-container" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bg)", borderRadius: 10 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div className="tbar">
          <span className="tbar-title">Your Applications</span>
          <div className="tbar-right">
            <button className="ico-btn" style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #D1D5DB", color: "var(--fg-3)" }}>
              <Search />
            </button>
            <button className="btn btn-dark" onClick={openChat}>
              <Plus stroke="white" />
              Apply
            </button>
          </div>
        </div>

        <div style={{ overflowY: "auto", flex: 1, padding: "24px 28px" }} key={navKey} className="page-enter">
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start", minWidth: "min-content" }}>
            {LANES.map((lane) => {
              const cards = board[lane.key];
              const isOver = over === lane.key && drag && drag.from !== lane.key;
              return (
                <div
                  key={lane.key}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (over !== lane.key) setOver(lane.key);
                  }}
                  onDragLeave={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) setOver((o) => (o === lane.key ? null : o));
                  }}
                  onDrop={() => drop(lane.key)}
                  style={{
                    flex: "1 1 0",
                    minWidth: 260,
                    maxWidth: 360,
                    background: isOver ? "#EAF1FE" : lane.laneBg,
                    border: isOver ? "1.5px dashed #1D4ED8" : "1.5px dashed transparent",
                    borderRadius: 10,
                    padding: 12,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    transition: "background .15s, border-color .15s",
                  }}
                >
                  {/* Lane header + controls */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "2px 2px 2px 4px" }}>
                    <span className="m3-label-large" style={{ color: "var(--fg)" }}>{lane.label}</span>
                    <span className="m3-label-small" style={{ background: lane.countBg, color: lane.countColor, padding: "2px 8px", borderRadius: 20 }}>{cards.length}</span>
                    <div style={{ marginLeft: "auto", display: "flex", gap: 2, position: "relative" }}>
                      <button className="ico-btn" title="Add application" onClick={openChat} style={{ width: 26, height: 26 }}>
                        <Plus size={14} />
                      </button>
                      <button className="ico-btn" title="Lane options" onClick={() => setMenuLane((m) => (m === lane.key ? null : lane.key))} style={{ width: 26, height: 26 }}>
                        <Dots size={15} />
                      </button>
                      {menuLane === lane.key && (
                        <div onMouseLeave={() => setMenuLane(null)} style={{ position: "absolute", top: 30, right: 0, width: 150, background: "#fff", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12),0 2px 6px rgba(0,0,0,0.06)", zIndex: 300, overflow: "hidden", padding: "4px 0", animation: "pageIn .18s cubic-bezier(.34,1.1,.64,1) both" }}>
                          {["Sort by date", "Collapse lane", "Clear lane"].map((opt) => (
                            <div
                              key={opt}
                              onClick={() => {
                                if (opt === "Clear lane") setBoard((b) => ({ ...b, [lane.key]: [] }));
                                setMenuLane(null);
                              }}
                              className="m3-body-small"
                              style={{ padding: "8px 14px", color: opt === "Clear lane" ? "#C0392B" : "var(--fg)", cursor: "pointer" }}
                              onMouseOver={(e) => (e.currentTarget.style.background = "var(--bg-2)")}
                              onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cards */}
                  {cards.length === 0 ? (
                    <div className="m3-body-small" style={{ color: "var(--fg-4)", textAlign: "center", padding: "20px 0" }}>Drop cards here</div>
                  ) : (
                    cards.map((card) => (
                      <CardView
                        key={card.ref}
                        card={card}
                        dragging={drag?.ref === card.ref}
                        onDragStart={() => setDrag({ from: lane.key, ref: card.ref })}
                        onDragEnd={() => { setDrag(null); setOver(null); }}
                        onClick={() => openAppDetail(card.ref)}
                      />
                    ))
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function CardView({ card, dragging, onDragStart, onDragEnd, onClick }: { card: KCard; dragging: boolean; onDragStart: () => void; onDragEnd: () => void; onClick: () => void }) {
  const base: React.CSSProperties = {
    cursor: "grab",
    borderRadius: 10,
    padding: 18,
    display: "flex",
    flexDirection: "column",
    gap: 9,
    transition: "background .15s, box-shadow .15s, opacity .15s",
    width: "100%",
    background: card.isDraft ? "#fff" : card.bg,
    opacity: dragging ? 0.5 : 1,
    boxShadow: dragging ? "0 8px 20px rgba(0,0,0,0.12)" : "none",
  };
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      style={base}
      onMouseOver={(e) => (e.currentTarget.style.background = card.isDraft ? "#F3F4F6" : (card.hover as string))}
      onMouseOut={(e) => (e.currentTarget.style.background = card.isDraft ? "#fff" : (card.bg as string))}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div className="m3-label-large" style={{ color: "var(--fg)" }}>{card.title}</div>
        <span className={"badge " + card.badgeClass} style={{ flexShrink: 0 }}>{card.badge}</span>
      </div>
      <div className="m3-body-small" style={{ color: card.metaColor || "var(--fg-3)" }}>{card.meta}</div>
      {/* consistent stage progress */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
        <div style={{ display: "flex", gap: 3, flex: 1 }}>
          {[0, 1, 2, 3].map((i) => {
            const done = i < (PROGRESS[card.badgeClass] ?? 1);
            return <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: done ? (card.metaColor || "var(--fg-3)") : "rgba(0,0,0,0.08)" }} />;
          })}
        </div>
        <span className="m3-label-small" style={{ color: "var(--fg-3)", flexShrink: 0 }}>{PROGRESS[card.badgeClass] ?? 1}/4</span>
      </div>
    </div>
  );
}
