"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "./AppContext";
import { WZ_STEPS, DOCS_MAP } from "@/lib/data";
import { Close, Check, Upload, ArrowLeft, ArrowRight } from "./Icons";

export default function SidePanel() {
  const { spMode } = useApp();
  const open = spMode === "wizard";
  return (
    <div className={"side-panel" + (open ? " wizard" : "")}>
      {open && <Wizard />}
    </div>
  );
}

function Wizard() {
  const { wzStep, wzData, wzNext, wzBack, wzSubmit, wzSubmitted, closeSP, goto } = useApp();

  if (wzSubmitted) return <SuccessView onDone={closeSP} onView={() => { closeSP(); goto("apps"); }} />;

  return (
    <>
      <div className="sp-head">
        <div>
          <span className="sp-title">Application form</span>
          <div className="m3-body-small" style={{ color: "var(--fg-3)", marginTop: 1 }}>Step {wzStep} of {WZ_STEPS.length}</div>
        </div>
        <button className="sp-close" onClick={closeSP}>
          <Close />
        </button>
      </div>

      <div className="wz-progress">
        {WZ_STEPS.map((label, i) => {
          const n = i + 1;
          const cls = wzStep > n ? "done" : wzStep === n ? "active" : "pending";
          return (
            <React.Fragment key={label}>
              <div className="wz-step">
                <div className={"wz-dot " + cls}>{wzStep > n ? <Check size={9} /> : n}</div>
                <div className={"wz-label" + (wzStep === n ? " active" : "")}>{label}</div>
              </div>
              {i < WZ_STEPS.length - 1 && <div className={"wz-line" + (wzStep > n ? " done" : "")} />}
            </React.Fragment>
          );
        })}
      </div>

      <div className="wz-body" key={wzStep} style={{ animation: "wizBodyIn .28s cubic-bezier(.34,1.1,.64,1) both" }}>
        {wzStep === 1 && <StepDetails permitKey={wzData.permitKey} />}
        {wzStep === 2 && <StepLocation />}
        {wzStep === 3 && <StepDocs permitKey={wzData.permitKey} />}
        {wzStep === 4 && <StepReview permitType={wzData.permitType} />}
      </div>

      <div className="wz-foot">
        {wzStep > 1 ? (
          <button className="wz-btn ghost" onClick={wzBack} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}><ArrowLeft size={14} /> Back</button>
        ) : (
          <button className="wz-btn ghost" onClick={closeSP}>Cancel</button>
        )}
        {wzStep < 4 ? (
          <button className="wz-btn primary" onClick={wzNext} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}>Continue <ArrowRight size={14} stroke="currentColor" /></button>
        ) : (
          <button className="wz-btn primary" onClick={wzSubmit}>Submit application</button>
        )}
      </div>
    </>
  );
}

// ── Step 1: details (varies by permit) ──
function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="wz-field">
      <label className="wz-label-text">{label}</label>
      {children}
      {hint && <div className="wz-hint">{hint}</div>}
    </div>
  );
}

function StepDetails({ permitKey }: { permitKey: string }) {
  if (permitKey === "cafe") return <DetailsBusiness />;
  if (permitKey === "truck") return <DetailsVendor />;
  if (permitKey === "event") return <DetailsEvent />;
  if (permitKey === "tree") return <DetailsTree />;
  return <DetailsBuilding />;
}

function DetailsBuilding() {
  return (
    <>
      <div className="wz-title">Project details</div>
      <div className="wz-sub">Tell us about the construction or renovation work.</div>
      <Field label="Work type">
        <select className="wz-select" defaultValue="Residential addition or extension">
          <option>Select one…</option>
          <option>Residential addition or extension</option>
          <option>Interior renovation</option>
          <option>New construction</option>
          <option>Deck or fence</option>
          <option>Garage or accessory structure</option>
        </select>
      </Field>
      <Field label="Project description" hint="A clear description helps reviewers process your application faster.">
        <textarea className="wz-textarea" rows={3} placeholder="Describe the scope of work…" />
      </Field>
      <Field label="Estimated project value ($)" hint="Used to calculate the permit fee">
        <input className="wz-input" type="text" placeholder="e.g. 75,000" />
      </Field>
      <Field label="Approximate floor area (sq ft)">
        <input className="wz-input" type="text" placeholder="e.g. 400" />
      </Field>
      <Field label="Applicant type">
        <select className="wz-select" defaultValue="Property owner">
          <option>Property owner</option>
          <option>Licensed contractor</option>
          <option>Authorized agent</option>
        </select>
      </Field>
    </>
  );
}

function DetailsBusiness() {
  return (
    <>
      <div className="wz-title">Business details</div>
      <div className="wz-sub">Tell us about the business you are opening or operating.</div>
      <Field label="Business name"><input className="wz-input" type="text" placeholder="e.g. Lees Corner Cafe" /></Field>
      <Field label="Business type">
        <select className="wz-select" defaultValue="Food service establishment">
          <option>Select one…</option>
          <option>Food service establishment</option>
          <option>Retail</option>
          <option>Personal services</option>
          <option>Home-based business</option>
        </select>
      </Field>
      <Field label="Number of employees"><input className="wz-input" type="number" placeholder="e.g. 5" /></Field>
      <Field label="New business or renewal?">
        <select className="wz-select" defaultValue="New business">
          <option>New business</option>
          <option>Renewal / change of ownership</option>
        </select>
      </Field>
      <Field label="Business registration number"><input className="wz-input" type="text" placeholder="Ontario business reg. number" /></Field>
    </>
  );
}

function DetailsVendor() {
  return (
    <>
      <div className="wz-title">Vendor details</div>
      <div className="wz-sub">Tell us about your street vending or food truck operation.</div>
      <Field label="Business name"><input className="wz-input" type="text" placeholder="e.g. Tacos El Norte" /></Field>
      <Field label="Vendor type">
        <select className="wz-select" defaultValue="Food truck">
          <option>Food truck</option>
          <option>Market stall</option>
          <option>Pop-up cart</option>
        </select>
      </Field>
      <Field label="Preferred operating zone">
        <select className="wz-select" defaultValue="King St West">
          <option>Select zone…</option>
          <option>King St West</option>
          <option>Kensington Market</option>
          <option>St. Lawrence Market</option>
          <option>Other</option>
        </select>
      </Field>
      <Field label="Vehicle license plate"><input className="wz-input" type="text" placeholder="e.g. ABCD 123" /></Field>
      <Field label="Existing business license?">
        <select className="wz-select" defaultValue="Yes">
          <option>Yes</option>
          <option>No — I need to apply for one</option>
        </select>
      </Field>
    </>
  );
}

function DetailsEvent() {
  return (
    <>
      <div className="wz-title">Event details</div>
      <div className="wz-sub">Tell us about the public event you are planning.</div>
      <Field label="Event name"><input className="wz-input" type="text" placeholder="e.g. Elm Street Summer Block Party" /></Field>
      <Field label="Event type">
        <select className="wz-select" defaultValue="Block party / street festival">
          <option>Select one…</option>
          <option>Block party / street festival</option>
          <option>Concert or performance</option>
          <option>Farmers market</option>
          <option>Charity event</option>
        </select>
      </Field>
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <div className="wz-field" style={{ flex: 1, marginBottom: 0 }}>
          <label className="wz-label-text">Start date</label>
          <input className="wz-input" type="date" />
        </div>
        <div className="wz-field" style={{ flex: 1, marginBottom: 0 }}>
          <label className="wz-label-text">End date</label>
          <input className="wz-input" type="date" />
        </div>
      </div>
      <Field label="Expected attendance">
        <select className="wz-select" defaultValue="Under 500 people">
          <option>Select range…</option>
          <option>Under 500 people</option>
          <option>500–1,000 people</option>
          <option>Over 1,000 people</option>
        </select>
      </Field>
      <Field label="Road closure needed?">
        <select className="wz-select" defaultValue="Yes"><option>Yes</option><option>No</option></select>
      </Field>
      <Field label="Amplified sound?">
        <select className="wz-select" defaultValue="Yes"><option>Yes</option><option>No</option></select>
      </Field>
    </>
  );
}

function DetailsTree() {
  return (
    <>
      <div className="wz-title">Tree removal details</div>
      <div className="wz-sub">Tell us about the tree you need to remove or prune.</div>
      <Field label="Reason for removal">
        <select className="wz-select" defaultValue="Tree is dead or dying">
          <option>Select one…</option>
          <option>Tree is dead or dying</option>
          <option>Tree is causing structural damage</option>
          <option>Construction or development</option>
          <option>Tree is a safety hazard</option>
        </select>
      </Field>
      <Field label="Number of trees"><input className="wz-input" type="number" placeholder="e.g. 1" defaultValue={1} /></Field>
      <Field label="Approximate trunk circumference (cm)"><input className="wz-input" type="text" placeholder="e.g. 45 cm" /></Field>
      <Field label="Tree species (if known)"><input className="wz-input" type="text" placeholder="e.g. Red oak" /></Field>
      <Field label="Arborist assessment?">
        <select className="wz-select" defaultValue="Yes — report attached">
          <option>Yes — report attached</option>
          <option>No</option>
        </select>
      </Field>
    </>
  );
}

// ── Step 2: location ──
function StepLocation() {
  return (
    <>
      <div className="wz-title">Property location</div>
      <div className="wz-sub">Enter the address where the work will take place.</div>
      <Field label="Street address"><input className="wz-input" type="text" defaultValue="42 Maple Avenue" /></Field>
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <div className="wz-field" style={{ flex: 1, marginBottom: 0 }}>
          <label className="wz-label-text">City</label>
          <input className="wz-input" defaultValue="Toronto" />
        </div>
        <div className="wz-field" style={{ flex: 1, marginBottom: 0 }}>
          <label className="wz-label-text">Postal code</label>
          <input className="wz-input" defaultValue="M5R 2E4" />
        </div>
      </div>
      <Field label="Owner name">
        <div style={{ display: "flex", gap: 8 }}>
          <input className="wz-input" placeholder="First" defaultValue="Jamie" />
          <input className="wz-input" placeholder="Last" defaultValue="Lee" />
        </div>
      </Field>
      <Field label="Email"><input className="wz-input" type="email" defaultValue="jamie.lee@email.com" /></Field>
      <Field label="Phone"><input className="wz-input" type="tel" defaultValue="(416) 555-0182" /></Field>
    </>
  );
}

// ── Step 3: documents ──
function StepDocs({ permitKey }: { permitKey: string }) {
  const docs = DOCS_MAP[permitKey] || DOCS_MAP.deck;
  const names = ["document-1.pdf", "certificate.pdf", "plan.pdf"];
  const sizes = ["1.2 MB", "0.8 MB", "2.1 MB"];
  const uploaded = docs.filter((d) => d.ok);
  const [extra, setExtra] = useState<string[]>([]);

  return (
    <>
      <div className="wz-title">Upload documents</div>
      <div className="wz-sub">Upload the required documents for your application.</div>
      <div className="wz-upload" onClick={() => setExtra((e) => [...e, "elevation-drawings.pdf"])}>
        <div style={{ marginBottom: 6 }}><Upload size={22} stroke="var(--fg-3)" /></div>
        <div className="wz-upload-title">Drop files here or click to upload</div>
        <div className="wz-upload-sub">PDF, JPG, PNG · Max 20 MB</div>
      </div>
      <div>
        {uploaded.map((d, i) => (
          <div className="wz-doc-item" key={i}>
            <Check size={12} stroke="var(--green)" />
            <span className="wz-doc-name">{names[i % 3]}</span>
            <span className="wz-doc-size">{sizes[i % 3]}</span>
          </div>
        ))}
        {extra.map((n, i) => (
          <div className="wz-doc-item" key={"e" + i}>
            <Check size={12} stroke="var(--green)" />
            <span className="wz-doc-name">{n}</span>
            <span className="wz-doc-size">0.8 MB</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14 }}>
        <div className="m3-label-small" style={{ color: "var(--fg-3)", marginBottom: 8 }}>Required documents</div>
        {docs.map((d, i) => (
          <div className="wz-doc-req" key={i}>
            <div className={"wz-doc-dot" + (d.ok ? " ok" : "")} />
            {d.name}
          </div>
        ))}
      </div>
    </>
  );
}

// ── Step 4: review ──
function StepReview({ permitType }: { permitType: string }) {
  return (
    <>
      <div className="wz-title">Review &amp; submit</div>
      <div className="wz-sub">Check everything looks right before submitting.</div>
      <div className="wz-review-card">
        <div className="m3-label-small" style={{ color: "var(--fg-4)", marginBottom: 8 }}>Project</div>
        <ReviewRow k="Permit type" v={permitType} />
        <ReviewRow k="Work type" v="Residential addition" />
        <ReviewRow k="Project value" v="$75,000" />
      </div>
      <div className="wz-review-card">
        <div className="m3-label-small" style={{ color: "var(--fg-4)", marginBottom: 8 }}>Location &amp; owner</div>
        <ReviewRow k="Address" v="42 Maple Ave, Toronto" />
        <ReviewRow k="Owner" v="Jamie Lee" />
        <ReviewRow k="Email" v="jamie.lee@email.com" />
      </div>
      <div className="wz-review-card">
        <div className="m3-label-small" style={{ color: "var(--fg-4)", marginBottom: 8 }}>Estimated fee</div>
        <div className="wz-fee-row"><span style={{ color: "var(--fg-3)" }}>Base fee</span><span>$185.00</span></div>
        <div className="wz-fee-row"><span style={{ color: "var(--fg-3)" }}>Valuation fee</span><span>$450.00</span></div>
        <div className="wz-fee-row"><span>Total</span><span>$635.00</span></div>
      </div>
      <div className="wz-consent">
        <input type="checkbox" style={{ marginTop: 2, flexShrink: 0 }} />
        <span>I confirm all information is accurate and I am authorized to apply for this permit on behalf of the property owner.</span>
      </div>
    </>
  );
}

function ReviewRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="wz-review-row">
      <span className="wz-rk">{k}</span>
      <span className="wz-rv">{v}</span>
    </div>
  );
}

// ── Success ──
function SuccessView({ onDone, onView }: { onDone: () => void; onView: () => void }) {
  const [pieces, setPieces] = useState<React.CSSProperties[]>([]);
  useEffect(() => {
    const colors = ["#1A56DB", "#0A7C52", "#9A5E00", "#C0392B", "#6B8EF5", "#E8B84B"];
    const shapes = ["2px", "50%", "2px"];
    const rotate = [false, false, true];
    const arr: React.CSSProperties[] = [];
    for (let i = 0; i < 36; i++) {
      const ci = Math.floor(Math.random() * colors.length);
      const si = Math.floor(Math.random() * shapes.length);
      const left = 10 + Math.random() * 80;
      const delay = Math.random() * 0.8;
      const dur = 1.2 + Math.random() * 1.2;
      const size = 5 + Math.random() * 7;
      arr.push({
        position: "absolute",
        left: left + "%",
        top: -10,
        width: size,
        height: size,
        background: colors[ci],
        borderRadius: shapes[si],
        transform: rotate[si] ? "rotate(45deg)" : undefined,
        animation: `confettiFall linear ${dur}s ${delay}s forwards`,
        opacity: 0,
      });
    }
    setPieces(arr);
  }, []);

  return (
    <div className="wz-success" style={{ flex: 1 }}>
      {pieces.map((s, i) => (
        <div key={i} className="wz-confetti-piece" style={s} />
      ))}
      <div className="wz-success-icon">
        <Check size={22} stroke="var(--green)" />
      </div>
      <div className="wz-success-title">Application submitted!</div>
      <div className="wz-success-sub">You will receive an email confirmation shortly. We will notify you at every stage of the review.</div>
      <div className="wz-ref">
        <span style={{ color: "var(--fg-3)", fontWeight: 400 }}>Reference #:</span> <span style={{ fontFamily: "monospace", fontWeight: 600 }}>BP-2024-1042</span>
      </div>
      <div className="wz-next">
        <div className="wz-next-title">What happens next</div>
        <div className="wz-next-item"><div className="wz-next-num">1</div>Completeness check — we verify your documents (1 business day)</div>
        <div className="wz-next-item"><div className="wz-next-num">2</div>Technical review — a building inspector reviews your plans (5–8 days)</div>
        <div className="wz-next-item"><div className="wz-next-num">3</div>Decision issued — approval or change request sent by email</div>
      </div>
      <div className="wz-done-btn" style={{ display: "flex", gap: 8, width: "100%" }}>
        <button className="wz-btn ghost" onClick={onDone} style={{ flex: 1 }}>Done</button>
        <button className="wz-btn primary" onClick={onView} style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}>View application <ArrowRight size={14} stroke="currentColor" /></button>
      </div>
    </div>
  );
}
