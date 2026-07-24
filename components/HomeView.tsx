"use client";

import React, { useEffect, useRef, useState } from "react";
import { useApp } from "./AppContext";
import { Bell, Plus, Building, Business, Clock, ArrowRight, Sparkle, Close, Warn, CaretRight } from "./Icons";

interface RecentApp {
  ref?: string;
  icoBg: string;
  icon: React.ReactNode;
  name: string;
  meta: string;
  badge: string;
  badgeClass: string;
  date: string;
}

const RECENT: RecentApp[] = [
  {
    ref: "BP-2024-0841",
    icoBg: "var(--brand-s)",
    icon: <Building />,
    name: "Residential addition — 42 Maple Ave",
    meta: "Building permit · BP-2024-0841",
    badge: "In review",
    badgeClass: "br",
    date: "Apr 28",
  },
  {
    icoBg: "var(--amber-s)",
    icon: <Clock />,
    name: "Summer block party — Elm St",
    meta: "Event permit · EP-2024-0219",
    badge: "Info needed",
    badgeClass: "bp",
    date: "Apr 22",
  },
  {
    icoBg: "var(--green-s)",
    icon: <Business />,
    name: "Lee's Corner Café — business license",
    meta: "Business license · BL-2024-0073",
    badge: "Approved",
    badgeClass: "bg",
    date: "Mar 14",
  },
  {
    ref: "BP-2024-0912",
    icoBg: "var(--brand-s)",
    icon: <Building />,
    name: "Basement apartment — 42 Maple Ave",
    meta: "Building permit · BP-2024-0912",
    badge: "In review",
    badgeClass: "br",
    date: "May 6",
  },
];

function SkelLine({ w, h = 6, c = "#E6E8EC" }: { w: string | number; h?: number; c?: string }) {
  return <div style={{ width: w, height: h, borderRadius: 3, background: c }} />;
}

// Application stage progress (of 4) per status — Submitted → Completeness → Review → Decision
const PROGRESS: Record<string, number> = { bd: 1, bp: 2, br: 3, bg: 4 };

// Preview background tint per status
const DESK: Record<string, string> = {
  br: "#EBF1FD", // in review — blue
  bp: "#FCF4E5", // info needed — amber
  bg: "#E8F6EF", // approved — green
  bd: "#EEEFF2", // draft — grey
};

// A letter-size (8.5×11) paper sheet with uniform grey skeleton lines, cropped at the bottom.
function MockDoc({ badgeClass }: { badgeClass: string }) {
  const desk = DESK[badgeClass] ?? DESK.bd;
  return (
    <div style={{ height: 150, overflow: "hidden", background: desk, display: "flex", justifyContent: "center", paddingTop: 18 }}>
      <div style={{ width: "70%", aspectRatio: "8.5 / 11", flexShrink: 0, background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.09)", borderRadius: "5px 5px 0 0", padding: "16px 16px 0", display: "flex", flexDirection: "column", gap: 8 }}>
        <SkelLine w="52%" h={8} c="#D3D6DC" />
        <div style={{ height: 2 }} />
        <SkelLine w="100%" />
        <SkelLine w="100%" />
        <SkelLine w="100%" />
        <SkelLine w="70%" />
        <div style={{ height: 4 }} />
        <SkelLine w="100%" />
        <SkelLine w="100%" />
        <SkelLine w="86%" />
      </div>
    </div>
  );
}

const QUICK = [
  { bg: "var(--brand-s)", icon: <Building />, label: "Building permit", desc: "New builds, additions, renovations" },
  { bg: "var(--green-s)", icon: <Business />, label: "Business license", desc: "New business or renewal" },
  { bg: "var(--amber-s)", icon: <Clock />, label: "Event permit", desc: "Public gatherings & festivals" },
];

export default function HomeView() {
  const { openChat, goto, openAppDetail, openPayModal, notifOpen, setNotifOpen, navKey } = useApp();
  const [promoVisible, setPromoVisible] = useState(true);
  const notifRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (
        notifOpen &&
        notifRef.current &&
        btnRef.current &&
        !notifRef.current.contains(e.target as Node) &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [notifOpen, setNotifOpen]);

  return (
    <div id="home-container" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "transparent", position: "relative" }}>
        <div className="tbar" style={{ background: "transparent", borderBottom: "none" }}>
          <span className="tbar-title">Good morning, Jamie</span>
          <div className="tbar-right">
            <button
              ref={btnRef}
              onClick={(e) => {
                e.stopPropagation();
                setNotifOpen(!notifOpen);
              }}
              style={{
                position: "relative",
                width: 34,
                height: 34,
                borderRadius: 8,
                border: "1.5px solid #D1D5DB",
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--fg-3)",
              }}
            >
              <Bell />
              <span style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, background: "#1D4ED8", borderRadius: "50%", border: "1.5px solid #EEEEF2" }} />
            </button>
            <button className="btn btn-dark" onClick={openChat}>
              <Plus stroke="white" />
              Apply
            </button>
          </div>
        </div>

        {notifOpen && <NotifPanel innerRef={notifRef} />}

        <div style={{ overflowY: "auto", flex: 1, display: "flex" }}>
          {/* LEFT */}
          <div style={{ flex: 1, minWidth: 0, padding: "20px 20px 28px 28px" }} key={navKey} className="page-enter">
            {/* Fees + promo as two columns */}
            <div style={{ display: "flex", gap: 12, marginBottom: 22, alignItems: "stretch" }}>
            {/* Balance callout */}
            <div className="right-card" style={{ flex: 1, minWidth: 0, padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: "transparent", border: "1px solid var(--line)" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
                  <span className="m3-label-medium" style={{ color: "var(--ds-on-surface-dim)" }}>Fees outstanding</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#FFFBEB", color: "#B45309", fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 20, animation: "duePulse 2s ease-out infinite" }}>
                    <Warn size={10} />
                    Due on approval
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 2, lineHeight: 1, marginBottom: 0 }}>
                  <span className="m3-headline-medium" style={{ color: "#6B7280" }}>$</span>
                  <span className="m3-display-medium" style={{ color: "var(--ds-on-surface)" }}>635.00</span>
                </div>
              </div>
              <button
                onClick={openPayModal}
                className="m3-label-large"
                style={{ padding: "8px 16px", background: "#1D4ED8", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "var(--font)", boxShadow: "0 1px 2px rgba(29,78,216,0.25)" }}
              >
                Pay now
              </button>
            </div>

            {/* Promo card */}
            {promoVisible && (
              <div className="right-card" style={{ flex: 1, minWidth: 0, padding: 0, position: "relative", overflow: "hidden", borderRadius: 10 }}>
                <button
                  onClick={() => setPromoVisible(false)}
                  style={{ position: "absolute", top: 10, right: 10, width: 24, height: 24, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ds-on-surface-dim)", borderRadius: 4, zIndex: 1 }}
                >
                  <Close />
                </button>
                <div style={{ display: "flex", alignItems: "stretch", gap: 14, padding: "0 36px 0 0" }}>
                  <div style={{ flex: "0 0 38%", alignSelf: "stretch", minHeight: 96 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block", borderRadius: "10px 0 0 10px" }}
                      src="/promo.jpg"
                      alt="Permit filing"
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0, padding: "14px 0", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div className="m3-label-large" style={{ color: "var(--ds-on-surface)", marginBottom: 3 }}>Save 20% on permit fees</div>
                    <div className="m3-body-small" style={{ color: "var(--ds-on-surface-dim)", marginBottom: 8 }}>File through Permitly and get 20% off city processing fees automatically.</div>
                    <div className="m3-label-medium" style={{ color: "#1D4ED8", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>Learn more <ArrowRight size={12} /></div>
                  </div>
                </div>
              </div>
            )}
            </div>

            {/* Recent applications */}
            <div className="sh">
              <div className="sh-t">Recent applications</div>
              <button className="sh-l" onClick={() => goto("apps")} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>View all <ArrowRight size={12} stroke="currentColor" /></button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 22 }}>
              {RECENT.map((r, i) => (
                <div
                  key={i}
                  onClick={() => r.ref && openAppDetail(r.ref)}
                  style={{ display: "flex", flexDirection: "column", background: "#fff", border: "1px solid var(--line)", borderRadius: 12, padding: 14, cursor: "pointer", transition: "box-shadow .15s, transform .15s" }}
                  onMouseOver={(e) => { e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
                >
                  <div style={{ position: "relative", borderRadius: 8, overflow: "hidden", margin: "-8px -8px 0" }}>
                    <MockDoc badgeClass={r.badgeClass} />
                    <span className={"badge " + r.badgeClass} style={{ position: "absolute", top: 8, right: 8 }}>{r.badge}</span>
                  </div>
                  {/* stage progress bar (compact, segmented) */}
                  <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 13 }}>
                    {[0, 1, 2, 3].map((i) => {
                      const filled = i < (PROGRESS[r.badgeClass] ?? 1);
                      return <div key={i} style={{ width: 15, height: 4, borderRadius: 2, background: filled ? "var(--fg-4)" : "var(--bg-3)" }} />;
                    })}
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <div className="m3-title-small" style={{ color: "var(--fg)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</div>
                    <div className="m3-body-small" style={{ color: "var(--fg-3)", marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.meta} · {r.date}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--bg-2)", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <CaretRight size={15} stroke="var(--fg-2)" />
                    </div>
                    <span className="m3-label-large" style={{ color: "var(--fg-2)" }}>Open application</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent activity */}
            <div className="sh">
              <div className="sh-t">Recent activity</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 22 }}>
              {[
                { html: <><strong style={{ fontWeight: 500 }}>M. Chen</strong> left a note on your block party application</>, time: "2 hours ago" },
                { html: <><strong style={{ fontWeight: 500 }}>BP-2024-0841</strong> passed completeness check and entered technical review</>, time: "Yesterday" },
              ].map((a, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "flex-start", gap: 11, padding: "12px 14px", background: "rgba(180,148,80,0.07)", borderRadius: 10, cursor: "pointer", transition: "background .1s" }}
                  onMouseOver={(e) => (e.currentTarget.style.background = "rgba(180,148,80,0.12)")}
                  onMouseOut={(e) => (e.currentTarget.style.background = "rgba(180,148,80,0.07)")}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="m3-body-small" style={{ color: "var(--ds-on-surface)" }}>{a.html}</div>
                    <div className="m3-body-small" style={{ color: "var(--ds-on-surface-dim)", marginTop: 3 }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Apply for a permit */}
            <div className="sh">
              <div className="sh-t">Apply for a permit</div>
            </div>
            <div className="quick">
              {QUICK.map((q, i) => (
                <div className="qcard" key={i} onClick={openChat}>
                  <div className="qico" style={{ background: q.bg }}>{q.icon}</div>
                  <div className="ql">{q.label}</div>
                  <div className="qd">{q.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ width: 340, flexShrink: 0, padding: "20px 20px 28px 0", display: "flex", flexDirection: "column", gap: 10, overflowY: "auto" }}>
            <div className="m3-title-small" style={{ color: "var(--ds-on-surface)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>Needs attention</span>
              <span style={{ background: "rgba(217,119,6,0.12)", color: "#B45309", fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 20 }}>2</span>
            </div>
            <div className="right-card" onClick={() => goto("apps")} style={{ cursor: "pointer", padding: "12px 14px" }}>
              <div className="right-card-row-title">Summer block party</div>
              <div className="right-card-row-sub" style={{ marginTop: 2 }}>Reviewer requested revised site plan</div>
              <div className="right-card-row-badge" style={{ color: "#B45309", marginTop: 6 }}>Respond within 3 days</div>
            </div>
            <div className="right-card" onClick={() => goto("apps")} style={{ cursor: "pointer", padding: "12px 14px" }}>
              <div className="right-card-row-title">Food truck — King St West</div>
              <div className="right-card-row-sub" style={{ marginTop: 2 }}>Draft incomplete — 3 documents missing</div>
              <div className="right-card-row-badge" style={{ color: "#1D4ED8", marginTop: 6, display: "inline-flex", alignItems: "center", gap: 4 }}>Continue application <ArrowRight size={12} stroke="currentColor" /></div>
            </div>

            {/* AI promo */}
            <div
              onClick={openChat}
              style={{ background: "rgba(29,78,216,0.1)", borderRadius: 10, padding: 16, cursor: "pointer", transition: "background .2s" }}
              onMouseOver={(e) => (e.currentTarget.style.background = "rgba(29,78,216,0.16)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "rgba(29,78,216,0.1)")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(29,78,216,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Sparkle size={15} fill="#1D4ED8" />
                </div>
                <span className="m3-label-large" style={{ color: "#1D4ED8" }}>Not sure what you need?</span>
              </div>
              <p className="m3-body-small" style={{ color: "#1E40AF", marginBottom: 12 }}>Describe your project and the assistant will identify the right permits for you.</p>
              <div className="m3-label-medium" style={{ color: "#1D4ED8", display: "flex", alignItems: "center", gap: 4 }}>
                Ask the assistant <ArrowRight />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotifPanel({ innerRef }: { innerRef: React.RefObject<HTMLDivElement | null> }) {
  const unread = [
    { html: <><strong style={{ fontWeight: 500 }}>M. Chen</strong> requested a revised site plan for your block party application.</>, time: "2 hours ago" },
    { html: <><strong style={{ fontWeight: 500 }}>BP-2024-0841</strong> passed completeness check and is now in technical review.</>, time: "Yesterday at 3:14 PM" },
  ];
  const read = [
    { html: <><strong style={{ fontWeight: 500, color: "var(--fg)" }}>BL-2024-0073</strong> was approved and your license has been issued.</>, time: "Mar 14 at 11:02 AM" },
    { html: <>Your payment of <strong style={{ fontWeight: 500, color: "var(--fg)" }}>$567.00</strong> was received and confirmed.</>, time: "Mar 14 at 10:48 AM" },
  ];
  return (
    <div
      ref={innerRef}
      style={{ position: "absolute", top: 58, right: 20, width: 320, background: "#fff", borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.12),0 2px 8px rgba(0,0,0,0.06)", zIndex: 300, overflow: "hidden", animation: "pageIn .25s cubic-bezier(.34,1.1,.64,1) both" }}
    >
      <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="m3-label-large" style={{ color: "var(--fg)" }}>Notifications</span>
        <span className="m3-label-small" style={{ color: "#1D4ED8", cursor: "pointer" }}>Mark all read</span>
      </div>
      <div style={{ maxHeight: 340, overflowY: "auto" }}>
        {unread.map((n, i) => (
          <div key={i} style={{ display: "flex", gap: 10, padding: "12px 16px", background: "#F7FAFF", borderBottom: "1px solid var(--line)", cursor: "pointer" }}>
            <div style={{ width: 8, height: 8, background: "#1D4ED8", borderRadius: "50%", flexShrink: 0, marginTop: 5 }} />
            <div>
              <div className="m3-body-small" style={{ color: "var(--fg)", marginBottom: 2 }}>{n.html}</div>
              <div className="m3-body-small" style={{ color: "var(--fg-3)" }}>{n.time}</div>
            </div>
          </div>
        ))}
        {read.map((n, i) => (
          <div key={i} style={{ display: "flex", gap: 10, padding: "12px 16px", borderBottom: i === 0 ? "1px solid var(--line)" : "none", cursor: "pointer" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, marginTop: 5 }} />
            <div>
              <div className="m3-body-small" style={{ color: "var(--fg-2)", marginBottom: 2 }}>{n.html}</div>
              <div className="m3-body-small" style={{ color: "var(--fg-3)" }}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: "10px 16px", borderTop: "1px solid var(--line)", textAlign: "center" }}>
        <span className="m3-label-medium" style={{ color: "#1D4ED8", cursor: "pointer" }}>View all notifications</span>
      </div>
    </div>
  );
}
