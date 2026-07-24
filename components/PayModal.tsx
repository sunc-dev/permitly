"use client";

import React, { useEffect, useRef, useState } from "react";
import { useApp } from "./AppContext";
import { Close, ArrowRight, Check, Plus, Caret } from "./Icons";

export default function PayModal() {
  const { payOpen, closePayModal } = useApp();
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (payOpen) setStep(1);
  }, [payOpen]);

  if (!payOpen) return null;

  const titles = ["Payment details", "Review & confirm", "Payment confirmed"];

  return (
    <div className="bottom-sheet-overlay" onClick={(e) => e.target === e.currentTarget && closePayModal()}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div className="modal-title">{titles[step - 1]}</div>
            <div className="modal-sub">Building permit fee · BP-2024-0841</div>
          </div>
          <button className="modal-x" onClick={closePayModal}>
            <Close size={13} />
          </button>
        </div>
        <div id="pay-body" style={{ overflowY: "auto", flex: 1 }}>
          {step === 1 && <StepOTP onDone={() => setStep(2)} />}
          {step === 2 && <StepReview onPay={() => setStep(3)} />}
          {step === 3 && <StepDone onClose={closePayModal} />}
        </div>
      </div>
    </div>
  );
}

function OrderSummary() {
  return (
    <div style={{ flex: 1, padding: "40px 72px", borderRight: "1px solid var(--line)", display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div className="m3-body-small" style={{ color: "var(--fg-3)", marginBottom: 8 }}>Pay City of Toronto</div>
      <div className="m3-display-medium" style={{ color: "var(--fg)", marginBottom: 36 }}>$635.00</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "14px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div>
          <div className="m3-title-small" style={{ color: "var(--fg)" }}>Building permit fee</div>
          <div className="m3-body-small" style={{ color: "var(--fg-3)", marginTop: 3 }}>BP-2024-0841 · Residential addition, 42 Maple Ave</div>
        </div>
        <div className="m3-title-small" style={{ color: "var(--fg)" }}>$635.00</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
        <span className="m3-body-medium" style={{ color: "var(--fg-2)" }}>Subtotal</span>
        <span className="m3-body-medium" style={{ color: "var(--fg)" }}>$635.00</span>
      </div>
      <div className="m3-title-small" style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", color: "var(--fg)" }}>
        <span>Total due</span>
        <span>$635.00</span>
      </div>
    </div>
  );
}

function StepOTP({ onDone }: { onDone: () => void }) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  const handle = (idx: number, val: string) => {
    const v = val.replace(/[^0-9]/g, "").slice(0, 1);
    const next = [...digits];
    next[idx] = v;
    setDigits(next);
    if (v && idx < 5) refs.current[idx + 1]?.focus();
    const code = next.join("");
    if (code.length === 6) {
      if (code === "000000") {
        setTimeout(onDone, 400);
      } else {
        setError(true);
        setTimeout(() => {
          setDigits(["", "", "", "", "", ""]);
          setError(false);
          refs.current[0]?.focus();
        }, 800);
      }
    }
  };

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <OrderSummary />
      <div style={{ width: 520, flexShrink: 0, padding: "40px 72px", display: "flex", flexDirection: "column", background: "var(--bg-2)" }}>
        <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 10, padding: "28px 24px", boxShadow: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1D4ED8", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ArrowRight size={12} stroke="white" />
            </div>
            <span className="m3-title-medium" style={{ color: "var(--fg)" }}>link</span>
          </div>
          <div className="m3-title-large" style={{ color: "var(--fg)", marginBottom: 10, textAlign: "center" }}>Confirm it&apos;s you</div>
          <div className="m3-body-small" style={{ color: "var(--fg-3)", textAlign: "center", marginBottom: 24 }}>Enter the code sent to (•••) ••• •99 to use your saved information.</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 18 }}>
            {digits.map((d, k) => (
              <input
                key={k}
                ref={(el) => { refs.current[k] = el; }}
                maxLength={1}
                type="text"
                value={d}
                onChange={(e) => handle(k, e.target.value)}
                className="m3-headline-small"
                style={{ width: 44, height: 52, border: `1.5px solid ${error ? "#EF4444" : "var(--line)"}`, borderRadius: 10, textAlign: "center", fontFamily: "var(--font)", color: "var(--fg)", outline: "none", background: "#fff", transition: "border-color .15s", animation: error ? "shake .3s ease" : "" }}
                onFocus={(e) => !error && (e.target.style.borderColor = "#1D4ED8")}
                onBlur={(e) => !error && (e.target.style.borderColor = "var(--line)")}
              />
            ))}
          </div>
          <div className="m3-body-small" style={{ textAlign: "center", padding: "8px 12px", background: "#F8F9FB", borderRadius: 8, color: "var(--fg-3)" }}>💡 Tip: enter <strong>000000</strong> to continue</div>
        </div>
        <div style={{ textAlign: "center", marginTop: 18 }}>
          <span className="m3-label-large" style={{ color: "#1D4ED8", cursor: "pointer" }}>Send code to email instead</span>
        </div>
        <div className="m3-body-small" style={{ textAlign: "center", marginTop: "auto", paddingTop: 32, color: "var(--fg-4)" }}>
          Powered by <strong style={{ color: "var(--fg-3)", fontStyle: "italic" }}>stripe</strong> &nbsp;|&nbsp; Terms &nbsp; Privacy
        </div>
      </div>
    </div>
  );
}

function StepReview({ onPay }: { onPay: () => void }) {
  const [processing, setProcessing] = useState(false);
  const pay = () => {
    setProcessing(true);
    setTimeout(() => {
      launchPayConfetti();
      onPay();
    }, 1800);
  };
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <OrderSummary />
      <div style={{ width: 520, flexShrink: 0, padding: "40px 72px", display: "flex", flexDirection: "column", background: "var(--bg-2)" }}>
        <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 10, padding: "28px 24px", boxShadow: "none" }}>
          <div className="m3-title-medium" style={{ color: "var(--fg)", marginBottom: 20 }}>Pay with saved card</div>
          <CardSection />
          <div className="m3-body-small" style={{ color: "var(--fg-3)", marginBottom: 20 }}>By confirming, you authorize the City of Toronto to charge $635.00 to your card. This payment is non-refundable once processed.</div>
          <button onClick={pay} disabled={processing} className="m3-title-small" style={{ width: "100%", padding: 13, background: "#1D4ED8", color: "white", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "var(--font)", opacity: processing ? 0.7 : 1 }}>
            {processing ? "Processing…" : "Confirm payment · $635.00"}
          </button>
        </div>
        <div className="m3-body-small" style={{ textAlign: "center", marginTop: "auto", paddingTop: 32, color: "var(--fg-4)" }}>
          Powered by <strong style={{ color: "var(--fg-3)", fontStyle: "italic" }}>stripe</strong> &nbsp;|&nbsp; Terms &nbsp; Privacy
        </div>
      </div>
    </div>
  );
}

function CardSection() {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const mc = (
    <svg width="22" height="14" viewBox="0 0 32 20" fill="none">
      <circle cx="12" cy="10" r="8" fill="#EB001B" />
      <circle cx="20" cy="10" r="8" fill="#F79E1B" />
      <path d="M16 3.8a8 8 0 0 1 0 12.4A8 8 0 0 1 16 3.8z" fill="#FF5F00" />
    </svg>
  );
  return (
    <div>
      <div onClick={() => setPickerOpen((o) => !o)} style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, background: "var(--bg-2)", borderRadius: 10, marginBottom: 8, cursor: "pointer" }}>
        <div style={{ width: 44, height: 30, background: "#1A1F71", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="28" height="18" viewBox="0 0 32 20" fill="none">
            <circle cx="12" cy="10" r="8" fill="#EB001B" />
            <circle cx="20" cy="10" r="8" fill="#F79E1B" />
            <path d="M16 3.8a8 8 0 0 1 0 12.4A8 8 0 0 1 16 3.8z" fill="#FF5F00" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div className="m3-title-small" style={{ color: "var(--fg)" }}>•••• •••• •••• 3456</div>
          <div className="m3-body-small" style={{ color: "var(--fg-3)" }}>Jamie Lee · Expires 12/26</div>
        </div>
        <span style={{ display: "inline-flex", transition: "transform .2s", flexShrink: 0, transform: pickerOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
          <Caret size={16} />
        </span>
      </div>
      {pickerOpen && (
        <div style={{ border: "1.5px solid var(--line)", borderRadius: 10, overflow: "hidden", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", background: "#F0FDF4", borderBottom: "1px solid var(--line)" }}>
            <div style={{ width: 36, height: 24, background: "#1A1F71", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>{mc}</div>
            <div style={{ flex: 1 }}>
              <div className="m3-label-large" style={{ color: "var(--fg)" }}>•••• 3456</div>
              <div className="m3-label-small" style={{ color: "var(--fg-3)" }}>Expires 12/26</div>
            </div>
            <Check size={16} stroke="#1D4ED8" />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", borderBottom: "1px solid var(--line)", cursor: "pointer" }}>
            <div style={{ width: 36, height: 24, background: "#006FCF", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontSize: 8, fontWeight: 700 }}>AMEX</span>
            </div>
            <div style={{ flex: 1 }}>
              <div className="m3-label-large" style={{ color: "var(--fg)" }}>•••• 7823</div>
              <div className="m3-label-small" style={{ color: "var(--fg-3)" }}>Expires 08/25</div>
            </div>
          </div>
          <div onClick={() => setAddOpen((o) => !o)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 14px", cursor: "pointer" }}>
            <div style={{ width: 36, height: 24, border: "1.5px dashed var(--line)", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Plus size={12} stroke="var(--fg-3)" />
            </div>
            <span className="m3-label-large" style={{ color: "var(--fg)" }}>Add new payment method</span>
          </div>
          {addOpen && (
            <div style={{ padding: 14, borderTop: "1px solid var(--line)", background: "var(--bg-2)" }}>
              <input className="wz-input" type="text" placeholder="1234 5678 9012 3456" style={{ marginBottom: 8 }} />
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input className="wz-input" type="text" placeholder="MM / YY" style={{ flex: 1 }} />
                <input className="wz-input" type="text" placeholder="CVV" style={{ flex: 1 }} />
              </div>
              <input className="wz-input" type="text" placeholder="Name on card" style={{ marginBottom: 10 }} />
              <button className="m3-label-large" style={{ width: "100%", padding: 9, background: "#1D4ED8", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "var(--font)" }}>Save and use this card</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StepDone({ onClose }: { onClose: () => void }) {
  const rows = [
    { k: "Reference", v: "PAY-2024-8831", mono: true, color: "#1D4ED8" },
    { k: "Amount", v: "$635.00", color: "#1D4ED8", bold: true },
    { k: "Permit", v: "BP-2024-0841", color: "#0F1623" },
    { k: "Date", v: "May 11, 2026", color: "#0F1623" },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
      <div style={{ textAlign: "center", maxWidth: 420, padding: "48px 32px" }}>
        <div style={{ width: 68, height: 68, borderRadius: "50%", background: "#E8F5EE", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px", animation: "successPop .5s cubic-bezier(.34,1.56,.64,1) both" }}>
          <Check size={30} stroke="#1D4ED8" />
        </div>
        <div className="m3-headline-medium" style={{ color: "#0F1623", marginBottom: 8, animation: "successFadeUp .4s ease .15s both" }}>Payment confirmed</div>
        <div className="m3-body-medium" style={{ color: "#3A4358", marginBottom: 32, animation: "successFadeUp .4s ease .25s both" }}>$635.00 paid to City of Toronto</div>
        <div style={{ background: "#F3F4F7", borderRadius: 10, padding: 20, textAlign: "left", marginBottom: 24, animation: "successFadeUp .4s ease .35s both" }}>
          {rows.map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < rows.length - 1 ? "1px solid #E5E7EB" : "none" }}>
              <span className="m3-body-small" style={{ color: "#5E6675" }}>{r.k}</span>
              <span className="m3-label-large" style={{ fontWeight: r.bold || r.mono ? 600 : 500, color: r.color, fontFamily: r.mono ? "monospace" : undefined }}>{r.v}</span>
            </div>
          ))}
        </div>
        <div className="m3-body-small" style={{ color: "#5E6675", marginBottom: 28, animation: "successFadeUp .4s ease .45s both" }}>Receipt sent to jamie.lee@email.com</div>
        <button onClick={onClose} className="m3-title-small" style={{ padding: "12px 32px", background: "#1D4ED8", color: "white", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "var(--font)", animation: "successFadeUp .4s ease .55s both" }}>Done</button>
      </div>
    </div>
  );
}

function launchPayConfetti() {
  const count = 48;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "pay-confetti";
    const left = Math.random() * 100;
    const delay = Math.random() * 0.6;
    const dur = 1.8 + Math.random() * 1.4;
    const size = 5 + Math.random() * 5;
    const shapes = ["border-radius:1px", "border-radius:50%", "border-radius:0;transform-origin:center"];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const opacity = 0.6 + Math.random() * 0.4;
    p.style.cssText = `left:${left}vw;width:${size}px;height:${size}px;background:#1D4ED8;${shape};opacity:${opacity};animation:payConfetti ${dur}s ${delay}s cubic-bezier(.25,.46,.45,.94) forwards;`;
    document.body.appendChild(p);
    setTimeout((el: HTMLElement) => el.remove(), (delay + dur + 0.2) * 1000, p);
  }
}
