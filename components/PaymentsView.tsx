"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "./AppContext";
import { CreditCard, Download } from "./Icons";

const OUTSTANDING = [
  { title: "Building permit fee", sub: "BP-2024-0841 · Residential addition, 42 Maple Ave", dueLabel: "Due on approval", amount: "$635.00" },
  { title: "Event permit fee", sub: "EP-2024-0301 · Farmers market, Dundas Sq", dueLabel: "Due before Jun 1", amount: "$640.00" },
];

const ACTIVITY = [
  { desc: "Sign permit fee", sub: "Storefront sign, Lee's Corner Café", ref: "SP-2023-0301", date: "Oct 12, 2023", amount: "$240.00" },
  { desc: "Business license fee", sub: "Lee's Corner Café", ref: "BL-2024-0073", date: "Mar 14, 2024", amount: "$567.00" },
  { desc: "Event permit fee", sub: "Elm St Block Party", ref: "EP-2023-0412", date: "Aug 2, 2023", amount: "$210.00" },
  { desc: "Building permit fee", sub: "Basement renovation, 42 Maple Ave", ref: "BP-2022-1190", date: "Nov 9, 2022", amount: "$780.00" },
  { desc: "Fence permit fee", sub: "Rear yard fence, 42 Maple Ave", ref: "FN-2022-0455", date: "Jun 3, 2022", amount: "$155.00" },
  { desc: "Dog license renewal", sub: '"Biscuit"', ref: "DL-2024-1180", date: "Feb 1, 2024", amount: "$60.00" },
];

function exportPayments() {
  let csv = "Description,Reference,Date,Amount,Status\n";
  csv += "Business license fee - Lees Corner Cafe,BL-2024-0073,Mar 14 2024,$567.00,Paid\n";
  csv += "Event permit fee - Elm St Block Party,EP-2023-0412,Aug 2 2023,$210.00,Paid\n";
  csv += "Building permit fee - Basement renovation,BP-2022-1190,Nov 9 2022,$780.00,Paid\n";
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "permitly-payments.csv";
  a.click();
}

export default function PaymentsView() {
  const { openPayModal, navKey } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, [navKey]);

  return (
    <div id="payments-container" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bg)", borderRadius: 10 }}>
      <div className="tbar">
        <span className="tbar-title">Payments</span>
        <div className="tbar-right">
          <button className="btn btn-dark">
            <CreditCard size={11} stroke="white" />
            Pay
          </button>
        </div>
      </div>

      {loading ? <PaymentsSkeleton /> : (
        <div style={{ overflowY: "auto", flex: 1, padding: "24px 28px" }} className="page-enter">
          {/* Outstanding */}
          <div style={{ marginBottom: 32 }}>
            <div className="m3-title-medium" style={{ color: "var(--fg)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              Outstanding <span className="m3-label-small" style={{ background: "#FFFBEB", color: "#B45309", padding: "2px 8px", borderRadius: 20 }}>2</span>
            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
              {OUTSTANDING.map((o, i) => (
                <div key={i} style={{ background: "#FFFBEB", borderRadius: 10, padding: 20, flex: "1 1 320px", minWidth: 280, maxWidth: 560, cursor: "pointer", transition: "filter .15s" }} onMouseOver={(e) => (e.currentTarget.style.filter = "brightness(0.97)")} onMouseOut={(e) => (e.currentTarget.style.filter = "")}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <span className="m3-label-large" style={{ color: "var(--fg)" }}>{o.title}</span>
                    <span className="m3-label-small" style={{ background: "rgba(180,83,9,0.12)", color: "#B45309", padding: "2px 8px", borderRadius: 20 }}>Due</span>
                  </div>
                  <div className="m3-body-small" style={{ color: "#B45309", marginBottom: 14 }}>{o.sub}</div>
                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                    <div>
                      <div className="m3-body-small" style={{ color: "#B45309", marginBottom: 2 }}>{o.dueLabel}</div>
                      <div className="m3-headline-small" style={{ color: "var(--fg)" }}>{o.amount}</div>
                    </div>
                    <button onClick={openPayModal} className="m3-label-medium" style={{ padding: "7px 14px", background: "#B45309", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "var(--font)" }}>Pay now</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment activity */}
          <div>
            <div style={{ height: 1, background: "var(--line)", margin: "0 0 24px" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div className="m3-title-medium" style={{ color: "var(--fg)" }}>Payment activity</div>
              <button onClick={exportPayments} className="m3-label-medium" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", border: "1.5px solid #D1D5DB", borderRadius: 8, background: "transparent", color: "var(--fg-2)", cursor: "pointer", fontFamily: "var(--font)", transition: "background .1s" }} onMouseOver={(e) => (e.currentTarget.style.background = "rgba(29,78,216,0.06)")} onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}>
                <Download size={12} stroke="#1D4ED8" />
                Export CSV
              </button>
            </div>
            <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "none" }}>
              <div className="m3-label-small" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 100px", padding: "9px 16px", background: "#fff", borderBottom: "1px solid var(--line)", color: "var(--fg-3)" }}>
                <div>Description</div>
                <div>Reference</div>
                <div>Date</div>
                <div style={{ textAlign: "right" }}>Amount</div>
              </div>
              {ACTIVITY.map((a, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 100px", padding: "12px 16px", borderBottom: i < ACTIVITY.length - 1 ? "1px solid var(--line)" : "none", alignItems: "center", cursor: "pointer", transition: "background .1s", background: "#fff" }} onMouseOver={(e) => (e.currentTarget.style.background = "var(--bg-2)")} onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}>
                  <div>
                    <div className="m3-label-large" style={{ color: "var(--fg)" }}>{a.desc}</div>
                    <div className="m3-body-small" style={{ color: "var(--fg-3)", marginTop: 1 }}>{a.sub}</div>
                  </div>
                  <div className="m3-body-small" style={{ color: "var(--fg-3)", fontFamily: "monospace" }}>{a.ref}</div>
                  <div className="m3-body-small" style={{ color: "var(--fg-3)" }}>{a.date}</div>
                  <div style={{ textAlign: "right" }}>
                    <div className="m3-label-large" style={{ color: "var(--fg)" }}>{a.amount}</div>
                    <div style={{ fontSize: 10.5, color: "#047857", fontWeight: 500, marginTop: 1 }}>Paid</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PaymentsSkeleton() {
  return (
    <div style={{ overflowY: "auto", flex: 1, padding: "24px 28px" }} className="page-enter">
      <div style={{ marginBottom: 32 }}>
        <div className="skeleton skeleton-title" style={{ width: 160 }} />
        <div className="skeleton-card">
          <div className="skeleton" style={{ height: 14, width: "55%", marginBottom: 10 }} />
          <div className="skeleton" style={{ height: 11, width: "75%", marginBottom: 16 }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div className="skeleton" style={{ height: 11, width: 100, marginBottom: 6 }} />
              <div className="skeleton" style={{ height: 26, width: 90 }} />
            </div>
            <div className="skeleton" style={{ height: 32, width: 80, borderRadius: 8 }} />
          </div>
        </div>
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div className="skeleton skeleton-title" style={{ width: 140 }} />
          <div className="skeleton" style={{ height: 30, width: 110, borderRadius: 8 }} />
        </div>
        <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "none" }}>
          <div style={{ padding: "9px 16px", borderBottom: "1px solid var(--line)", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 100px", gap: 8 }}>
            <div className="skeleton" style={{ height: 11, width: 80 }} />
            <div className="skeleton" style={{ height: 11, width: 60 }} />
            <div className="skeleton" style={{ height: 11, width: 50 }} />
            <div className="skeleton" style={{ height: 11, width: 50, marginLeft: "auto" }} />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ padding: "14px 16px", borderBottom: "1px solid var(--line)", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 100px", gap: 8, alignItems: "center" }}>
              <div>
                <div className="skeleton" style={{ height: 13, width: "65%", marginBottom: 6 }} />
                <div className="skeleton" style={{ height: 11, width: "45%" }} />
              </div>
              <div className="skeleton" style={{ height: 12, width: "70%" }} />
              <div className="skeleton" style={{ height: 12, width: "60%" }} />
              <div style={{ marginLeft: "auto" }}>
                <div className="skeleton" style={{ height: 13, width: 50, marginLeft: "auto", marginBottom: 4 }} />
                <div className="skeleton" style={{ height: 11, width: 30, marginLeft: "auto" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
