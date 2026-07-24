"use client";

import React, { useEffect, useRef } from "react";
import { useApp } from "./AppContext";
import { Search, ChatBubble, Close } from "./Icons";

interface Row {
  title: string;
  meta: string;
  badge?: string;
  badgeClass?: string;
}
const GROUPS: { label: string; rows: Row[] }[] = [
  {
    label: "Today",
    rows: [
      { title: "I want to add a deck to my backyard", meta: "Building permit · 2 messages · 10:42 AM", badge: "In review", badgeClass: "br" },
      { title: "Do I need a permit to host a block party?", meta: "Event permit · 4 messages · 9:15 AM", badge: "Info needed", badgeClass: "bp" },
    ],
  },
  {
    label: "Yesterday",
    rows: [
      { title: "Opening a small café on Queen Street", meta: "Business license · 6 messages · Apr 28", badge: "Approved", badgeClass: "bg" },
      { title: "Basement apartment conversion on Maple Ave", meta: "Building permit · 8 messages · Apr 28" },
    ],
  },
  {
    label: "Last week",
    rows: [
      { title: "Food truck permit for King Street West", meta: "Vendor permit · 5 messages · Apr 23", badge: "Draft", badgeClass: "bd" },
      { title: "Tree removal permit — backyard oak", meta: "Tree removal · 3 messages · Apr 21" },
    ],
  },
];

export default function HistoryPanel() {
  const { histOpen, setHistOpen, openConversation } = useApp();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click (but ignore clicks on the sidebar History button, handled via a small delay)
  useEffect(() => {
    if (!histOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setHistOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [histOpen, setHistOpen]);

  const go = (prompt: string) => {
    setHistOpen(false);
    openConversation(prompt);
  };

  return (
    <div
      ref={panelRef}
      style={{
        width: histOpen ? 300 : 0,
        minWidth: histOpen ? 300 : 0,
        opacity: histOpen ? 1 : 0,
        flexShrink: 0,
        alignSelf: "stretch",
        background: "transparent",
        borderLeft: histOpen ? "1px solid #D3D7DE" : "1px solid transparent",
        borderRight: histOpen ? "1px solid #D3D7DE" : "1px solid transparent",
        marginRight: histOpen ? 8 : 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "width .32s cubic-bezier(.4,0,.2,1), min-width .32s cubic-bezier(.4,0,.2,1), opacity .2s ease, margin .32s ease",
        pointerEvents: histOpen ? "auto" : "none",
      }}
    >
      <div style={{ width: 300, display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "16px 14px 12px", borderBottom: "1px solid var(--line)", flexShrink: 0 }}>
          <div>
            <div className="m3-title-small" style={{ color: "var(--fg)" }}>History</div>
            <div className="m3-body-small" style={{ color: "var(--fg-3)", marginTop: 2 }}>Recent conversations</div>
          </div>
          <button className="sb-toggle" onClick={() => setHistOpen(false)} title="Close" style={{ display: "flex" }}>
            <Close size={13} />
          </button>
        </div>

        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderBottom: "1px solid var(--line)", color: "var(--fg-3)", flexShrink: 0 }}>
          <Search size={14} />
          <input className="hist-search-inp" placeholder="Search conversations…" style={{ background: "none" }} />
        </div>

        {/* Groups — styled like the nav, divider between each */}
        <div style={{ flex: 1, overflowY: "auto", padding: "4px 0" }}>
          {GROUPS.map((g, gi) => (
            <React.Fragment key={g.label}>
              {gi > 0 && <div style={{ height: 1, background: "#D3D7DE", margin: "8px 0" }} />}
              <p className="sb-group" style={{ padding: "8px 16px 4px" }}>{g.label}</p>
              {g.rows.map((r, i) => (
                <button className="sb-item" key={i} onClick={() => go(r.title)} style={{ alignItems: "flex-start", height: "auto", padding: "8px 12px" }}>
                  <span style={{ marginTop: 1, flexShrink: 0, display: "flex" }}>
                    <ChatBubble size={14} />
                  </span>
                  <span style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                    <span className="m3-label-medium" style={{ display: "block", color: "var(--fg)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.title}</span>
                    <span className="m3-body-small" style={{ display: "block", color: "var(--fg-3)", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.meta}</span>
                  </span>
                  {r.badge && <span className={"badge " + r.badgeClass} style={{ flexShrink: 0, alignSelf: "center" }}>{r.badge}</span>}
                </button>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
