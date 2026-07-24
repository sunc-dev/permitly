"use client";

import React from "react";
import { PD } from "@/lib/data";
import { useApp } from "./AppContext";
import { ArrowRight } from "./Icons";

export default function PermitCard({ type, permitKey }: { type: string; permitKey: string }) {
  const { startWizard } = useApp();
  const p = PD[permitKey];
  if (!p) return null;

  return (
    <div style={{ background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 10, overflow: "hidden", margin: "8px 0" }}>
      <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div className="m3-title-small" style={{ color: "var(--fg)" }}>{type}</div>
          <div className="m3-body-small" style={{ color: "var(--fg-3)", marginTop: 1 }}>City of Toronto</div>
        </div>
        <span className="m3-label-small" style={{ background: "var(--brand-s)", color: "var(--brand)", padding: "2px 9px", borderRadius: 20 }}>Permit info</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid var(--line)" }}>
        <div style={{ padding: "12px 14px", borderRight: "1px solid var(--line)" }}>
          <div className="m3-body-small" style={{ color: "var(--fg-3)", marginBottom: 3 }}>Estimated fee</div>
          <div className="m3-label-large" style={{ color: "var(--fg)" }}>{p.fee}</div>
        </div>
        <div style={{ padding: "12px 14px" }}>
          <div className="m3-body-small" style={{ color: "var(--fg-3)", marginBottom: 3 }}>Processing time</div>
          <div className="m3-label-large" style={{ color: "var(--fg)" }}>{p.time}</div>
        </div>
      </div>
      {p.docs.length > 0 && (
        <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--line)" }}>
          <div className="m3-body-small" style={{ color: "var(--fg-3)", marginBottom: 7 }}>Documents needed</div>
          <ul style={{ margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 4 }}>
            {p.docs.map((d, i) => (
              <li key={i} className="m3-body-small" style={{ color: "var(--fg-2)" }}>{d}</li>
            ))}
          </ul>
        </div>
      )}
      {p.tip && (
        <div style={{ padding: "10px 14px", background: "var(--amber-s)", borderBottom: "1px solid var(--line)" }}>
          <div className="m3-label-small" style={{ color: "var(--amber)", marginBottom: 2 }}>Tip</div>
          <div className="m3-body-small" style={{ color: "var(--amber)" }}>{p.tip}</div>
        </div>
      )}
      {permitKey !== "fence" && (
        <div style={{ padding: "12px 14px" }}>
          <button
            onClick={() => startWizard(type, permitKey)}
            className="m3-label-large"
            style={{ padding: "8px 18px", background: "#1D4ED8", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "var(--font)", boxShadow: "0 1px 2px rgba(29,78,216,0.25)", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            Start application <ArrowRight size={14} stroke="currentColor" />
          </button>
        </div>
      )}
    </div>
  );
}
