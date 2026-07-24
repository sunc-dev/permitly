"use client";

import React, { useMemo, useState } from "react";
import { useApp, APP_DATA } from "./AppContext";
import { Comment } from "@/lib/data";
import { ArrowLeft, ArrowRight, Comment as CommentIcon, Close, Check, ClockCircle, Warn } from "./Icons";

export default function AppDetail() {
  const { detailRef, closeAppDetail, openPayModal } = useApp();
  const app = detailRef ? APP_DATA[detailRef] : null;

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(() => (app ? app.comments.map((c) => ({ ...c })) : []));
  const [reply, setReply] = useState("");
  const [readAll, setReadAll] = useState(false);

  // Reset local state when the app changes
  const prevRef = React.useRef(detailRef);
  React.useEffect(() => {
    if (prevRef.current !== detailRef) {
      prevRef.current = detailRef;
      setShowComments(false);
      setComments(app ? app.comments.map((c) => ({ ...c })) : []);
      setReply("");
      setReadAll(false);
    }
  }, [detailRef, app]);

  const unread = useMemo(() => (readAll ? 0 : comments.filter((c) => c.unread).length), [comments, readAll]);

  if (!app) return null;

  const openCommentsPanel = () => {
    setReadAll(true);
    setShowComments(true);
  };
  const sendComment = () => {
    const text = reply.trim();
    if (!text) return;
    setComments((c) => [{ author: "Jamie Lee", role: "Applicant", time: "Just now", text, unread: false }, ...c]);
    setReply("");
  };

  return (
    <div id="app-detail-panel" style={{ display: "flex", flex: 1, flexDirection: "column", overflow: "hidden" }}>
      <div className="tbar" style={{ position: "relative" }}>
        {!showComments ? (
          <button
            onClick={closeAppDetail}
            style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #D1D5DB", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--fg-3)", marginRight: 8, flexShrink: 0 }}
          >
            <ArrowLeft />
          </button>
        ) : (
          <button
            onClick={() => setShowComments(false)}
            style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #D1D5DB", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--fg-3)", marginRight: 8, flexShrink: 0 }}
            title="Back"
          >
            <ArrowLeft />
          </button>
        )}
        <span className="tbar-title">{showComments ? "Reviewer messages" : app.title}</span>
        <div className="tbar-right">
          {!showComments && (
            <button
              onClick={openCommentsPanel}
              style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #D1D5DB", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--fg-3)", position: "relative" }}
            >
              <CommentIcon />
              {unread > 0 && <span style={{ position: "absolute", top: 5, right: 5, width: 7, height: 7, background: "#B45309", borderRadius: "50%", border: "1.5px solid var(--bg)" }} />}
            </button>
          )}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }} className={showComments ? "panels-on-comments" : ""} id="adet-panels-wrap">
        {/* Detail panel */}
        <div id="adet-panel" style={{ minWidth: "100%", display: "flex", flexDirection: "column", transition: "transform .35s cubic-bezier(.4,0,.2,1)" }}>
          <div style={{ overflowY: "auto", flex: 1, padding: "20px 28px", maxWidth: 720 }}>
            <DetailBody appRef={detailRef!} onPay={openPayModal} onViewMessages={openCommentsPanel} />
          </div>
        </div>
        {/* Comments panel */}
        <div id="comments-panel" style={{ minWidth: "100%", display: "flex", flexDirection: "column", transition: "transform .35s cubic-bezier(.4,0,.2,1)" }}>
          <div style={{ overflowY: "auto", flex: 1, padding: "16px 28px", display: "flex", flexDirection: "column", gap: 12, maxWidth: 720 }}>
            {comments.length === 0 ? (
              <div className="m3-body-small" style={{ textAlign: "center", color: "var(--fg-3)", padding: "32px 0" }}>No messages yet.</div>
            ) : (
              comments.map((c, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 10, padding: "14px 16px", boxShadow: "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--fg)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, flexShrink: 0 }}>
                      {c.author.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <div className="m3-label-large" style={{ color: "var(--fg)" }}>{c.author}</div>
                      <div className="m3-body-small" style={{ color: "var(--fg-3)" }}>{c.role} · {c.time}</div>
                    </div>
                    {c.unread && <span style={{ marginLeft: "auto", background: "#FFFBEB", color: "#B45309", fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 20 }}>New</span>}
                  </div>
                  <div className="m3-body-small" style={{ color: "var(--fg-2)" }}>{c.text}</div>
                </div>
              ))
            )}
          </div>
          <div style={{ padding: "12px 28px 20px", borderTop: "1px solid var(--line)", background: "var(--bg)", flexShrink: 0 }}>
            <div style={{ display: "flex", gap: 8, maxWidth: 720 }}>
              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendComment()}
                type="text"
                placeholder="Reply to reviewer…"
                className="m3-body-small"
                style={{ flex: 1, padding: "9px 12px", border: "1.5px solid #D1D5DB", borderRadius: 8, fontFamily: "var(--font)", outline: "none" }}
                onFocus={(e) => (e.target.style.borderColor = "#1D4ED8")}
                onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
              />
              <button onClick={sendComment} className="m3-label-large" style={{ padding: "9px 16px", background: "#1D4ED8", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "var(--font)" }}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailBody({ appRef, onPay, onViewMessages }: { appRef: string; onPay: () => void; onViewMessages: () => void }) {
  const { openChat, closeAppDetail } = useApp();
  const app = APP_DATA[appRef];

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span className={"badge " + app.badgeClass}>{app.badge}</span>
      </div>
      <div className="m3-body-medium" style={{ color: "var(--fg-2)", marginBottom: 20 }}>{app.description}</div>

      {app.status === "draft" && (
        <div style={{ marginBottom: 16 }}>
          <button
            onClick={() => {
              openChat();
              closeAppDetail();
            }}
            className="m3-label-large"
            style={{ padding: "10px 20px", background: "#1D4ED8", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "var(--font)", boxShadow: "0 1px 2px rgba(29,78,216,0.25)", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            Continue where you left off <ArrowRight size={14} stroke="currentColor" />
          </button>
        </div>
      )}

      {/* Fee card */}
      <div style={{ background: "#fff", borderRadius: 10, padding: "16px 18px", marginBottom: 12, boxShadow: "none" }}>
        <div className="m3-label-small" style={{ color: "var(--fg-3)", marginBottom: 10 }}>Payment</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div className="m3-headline-medium" style={{ color: "var(--fg)" }}>${app.fee.toFixed(2)}</div>
            {app.paid ? (
              <div className="m3-label-medium" style={{ color: "#047857", marginTop: 3 }}>Paid · {app.paidDate}</div>
            ) : app.status === "draft" ? (
              <div className="m3-body-small" style={{ color: "var(--fg-3)", marginTop: 3 }}>Due on submission</div>
            ) : (
              <div className="m3-label-medium" style={{ color: "#B45309", marginTop: 3 }}>Due on approval</div>
            )}
          </div>
          {app.paid ? (
            <button
              onClick={() => alert("Receipt " + app.receiptRef + " — download feature coming soon.")}
              className="m3-label-large"
              style={{ padding: "8px 16px", background: "transparent", color: "#1D4ED8", border: "1.5px solid #D1D5DB", borderRadius: 8, cursor: "pointer", fontFamily: "var(--font)" }}
            >
              View receipt
            </button>
          ) : app.status !== "draft" ? (
            <button onClick={onPay} className="m3-label-large" style={{ padding: "8px 16px", background: "#1D4ED8", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "var(--font)", boxShadow: "0 1px 2px rgba(29,78,216,0.25)" }}>Pay now</button>
          ) : null}
        </div>
      </div>

      {app.status === "in-review" && <InReviewSection onViewMessages={onViewMessages} />}
      {app.status !== "in-review" && app.outstanding.length > 0 && <ActionRequired items={app.outstanding} />}
      {app.status === "approved" && <ApprovedSection />}

      <Timeline app={app} />
    </>
  );
}

function InReviewSection({ onViewMessages }: { onViewMessages: () => void }) {
  const steps = [
    { done: true, label: "Application submitted", detail: "Apr 28, 2024" },
    { done: true, label: "Completeness check passed", detail: "Apr 29, 2024" },
    { done: false, label: "Technical review", detail: "In progress — inspector assigned", active: true },
    { done: false, label: "Decision issued", detail: "Approval or revision request sent by email" },
  ];
  return (
    <>
      <div style={{ background: "#EFF6FF", borderRadius: 10, padding: "16px 18px", marginBottom: 12, display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#BFDBFE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <ClockCircle size={16} stroke="#1D4ED8" />
        </div>
        <div>
          <div className="m3-title-small" style={{ color: "#1D4ED8", marginBottom: 2 }}>Under technical review</div>
          <div className="m3-body-small" style={{ color: "#1D4ED8" }}>A building inspector is reviewing your plans. Est. 5–8 business days from submission.</div>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 10, padding: "16px 18px", marginBottom: 12, boxShadow: "none" }}>
        <div className="m3-label-large" style={{ color: "var(--fg)", marginBottom: 12 }}>What happens next</div>
        {steps.map((step, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              {step.done ? (
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#1D4ED8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Check size={9} />
                </div>
              ) : step.active ? (
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#1D4ED8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "white", animation: "pulse 1.5s ease infinite" }} />
                </div>
              ) : (
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--bg-3)", border: "1.5px solid var(--line)" }} />
              )}
              {i < steps.length - 1 && <div style={{ width: 1.5, height: 22, background: step.done ? "#1D4ED8" : "var(--line)", margin: "3px 0" }} />}
            </div>
            <div style={{ paddingTop: 1 }}>
              <div className="m3-label-large" style={{ fontWeight: step.active ? 600 : 500, color: step.done || step.active ? "var(--fg)" : "var(--fg-3)" }}>{step.label}</div>
              <div className="m3-body-small" style={{ color: step.active ? "#1D4ED8" : "var(--fg-3)", marginTop: 1, marginBottom: 8 }}>{step.detail}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 10, padding: "14px 18px", marginBottom: 12, boxShadow: "none", display: "flex", alignItems: "center", gap: 12 }}>
        <div className="m3-label-medium" style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--fg)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>MC</div>
        <div>
          <div className="m3-label-large" style={{ color: "var(--fg)" }}>M. Chen</div>
          <div className="m3-body-small" style={{ color: "var(--fg-3)" }}>Assigned building inspector</div>
        </div>
        <div className="m3-label-medium" style={{ marginLeft: "auto", color: "#1D4ED8", cursor: "pointer" }} onClick={onViewMessages}>View messages</div>
      </div>
    </>
  );
}

function ActionRequired({ items }: { items: string[] }) {
  return (
    <div style={{ background: "#FFFBEB", borderRadius: 10, padding: "16px 18px", marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <Warn size={13} stroke="#B45309" />
        <span className="m3-label-medium" style={{ color: "#B45309" }}>Action required</span>
      </div>
      <ul style={{ paddingLeft: 16, display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map((item, i) => (
          <li key={i} className="m3-body-small" style={{ color: "#92400E" }}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function ApprovedSection() {
  return (
    <div style={{ background: "#ECFDF5", borderRadius: 10, padding: "16px 18px", marginBottom: 12, display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: "#A7F3D0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Check size={15} stroke="#047857" />
      </div>
      <div>
        <div className="m3-label-large" style={{ color: "#047857", marginBottom: 3 }}>Approved and issued</div>
        <div className="m3-body-small" style={{ color: "#065F46" }}>Your license has been approved and issued. Download your certificate from the Records section.</div>
      </div>
    </div>
  );
}

function Timeline({ app }: { app: (typeof APP_DATA)[string] }) {
  const steps = [
    { label: "Submitted", done: app.status !== "draft", date: app.submitted },
    { label: "Completeness check", done: ["in-review", "approved"].includes(app.status) },
    { label: "Technical review", done: app.status === "approved" },
    { label: "Decision", done: app.status === "approved" },
  ];
  return (
    <div style={{ background: "#fff", borderRadius: 10, padding: "16px 18px", boxShadow: "none" }}>
      <div className="m3-label-small" style={{ color: "var(--fg-3)", marginBottom: 12 }}>Timeline</div>
      {steps.map((step, i) => (
        <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", ...(step.done ? { background: "#1D4ED8" } : { background: "var(--bg-3)", border: "1.5px solid var(--line)" }) }}>
              {step.done && <Check size={8} />}
            </div>
            {i < steps.length - 1 && <div style={{ width: 1.5, height: 24, background: step.done ? "#1D4ED8" : "var(--line)", margin: "3px 0" }} />}
          </div>
          <div style={{ paddingTop: 1 }}>
            <div className="m3-label-large" style={{ color: step.done ? "var(--fg)" : "var(--fg-3)" }}>{step.label}</div>
            {step.date && <div className="m3-body-small" style={{ color: "var(--fg-3)", marginTop: 1 }}>{step.date}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
