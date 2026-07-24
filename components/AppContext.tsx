"use client";

import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { APP_DATA, AppRecord, Comment, fallback, detectP, PermitReply } from "@/lib/data";

// Reference-number prefix per permit type, matching the scheme already used
// in the seed data (BP-2024-xxxx, EP-2024-xxxx, etc.)
function refPrefixFor(permitKey: string): string {
  switch (permitKey) {
    case "cafe":
      return "BL";
    case "truck":
      return "VP";
    case "event":
      return "EP";
    case "tree":
      return "TP";
    default:
      return "BP"; // building, deck, basement
  }
}

export type View = "home" | "apps" | "payments" | "records" | "chat";

export interface ChatMsg {
  role: "ai" | "user";
  // Either a plain formatted text message, or a permit-card message
  intro?: string;
  outro?: string;
  card?: { type: string; key: string };
  text?: string;
}

interface AppState {
  // navigation
  view: View;
  goto: (v: View) => void;
  openChat: () => void;
  navKey: string; // used to retrigger page-enter animation

  // sidebar
  sbCollapsed: boolean;
  toggleSb: () => void;
  handleBrand: () => void;

  // notifications
  notifOpen: boolean;
  setNotifOpen: (v: boolean) => void;

  // history modal
  histOpen: boolean;
  setHistOpen: (v: boolean) => void;

  // payment modal
  payOpen: boolean;
  openPayModal: () => void;
  closePayModal: () => void;

  // app detail
  detailRef: string | null;
  openAppDetail: (ref: string) => void;
  closeAppDetail: () => void;

  // chat
  msgs: ChatMsg[];
  chatGone: boolean;
  chatBusy: boolean;
  sendMsg: (text: string) => void;
  resetChat: () => void;
  chatTitle: string;
  openConversation: (prompt: string, title?: string) => void;

  // side panel (permit details + wizard)
  spMode: "closed" | "details" | "wizard";
  spPermit: { type: string; key: string } | null;
  closeSP: () => void;
  startWizard: (type: string, key: string) => void;
  openDetailsPanel: (type: string, key: string) => void;

  // wizard
  wzStep: number;
  wzData: { permitType: string; permitKey: string };
  wzNext: () => void;
  wzBack: () => void;
  wzSubmit: () => void;
  wzSubmitted: boolean;

  // newly submitted applications (not part of the static seed data)
  newAppRefs: string[];
  lastSubmittedRef: string;
}

const Ctx = createContext<AppState | null>(null);

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used within AppProvider");
  return v;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<View>("home");
  const [navKey, setNavKey] = useState(0);
  const [sbCollapsed, setSbCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [histOpen, setHistOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [detailRef, setDetailRef] = useState<string | null>(null);

  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [chatGone, setChatGone] = useState(false);
  const [chatBusy, setChatBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  const [chatTitle, setChatTitle] = useState("New application");

  const [spMode, setSpMode] = useState<"closed" | "details" | "wizard">("closed");
  const [spPermit, setSpPermit] = useState<{ type: string; key: string } | null>(null);
  const [wzStep, setWzStep] = useState(1);
  const [wzData, setWzData] = useState({ permitType: "", permitKey: "" });
  const [wzSubmitted, setWzSubmitted] = useState(false);
  const [newAppRefs, setNewAppRefs] = useState<string[]>([]);
  const [lastSubmittedRef, setLastSubmittedRef] = useState("");
  const refCounter = useRef(1050);

  const bump = () => setNavKey((k) => k + 1);

  const closeSP = useCallback(() => {
    setSpMode("closed");
    setWzSubmitted(false);
  }, []);

  const goto = useCallback(
    (v: View) => {
      closeSP();
      setView(v);
      bump();
    },
    [closeSP]
  );

  const openChat = useCallback(() => {
    closeSP();
    setView("chat");
    bump();
  }, [closeSP]);

  // Open the chat pre-loaded with a mocked conversation for a recent topic.
  const openConversation = useCallback(
    (prompt: string, title?: string) => {
      closeSP();
      const reply = fallback(prompt);
      const next: ChatMsg[] = [{ role: "user", text: prompt }];
      if (reply && typeof reply === "object") {
        const r = reply as PermitReply;
        next.push({ role: "ai", intro: r.intro, outro: r.outro, card: { type: r.type, key: r.key } });
      } else {
        const det = detectP(prompt);
        next.push({ role: "ai", text: reply as string });
        if (det) next.push({ role: "ai", card: { type: det.type, key: det.key } });
      }
      setMsgs(next);
      setChatGone(true);
      setChatBusy(false);
      setTyping(false);
      setChatTitle(title ?? (prompt.length > 42 ? prompt.slice(0, 42) + "…" : prompt));
      setView("chat");
      bump();
    },
    [closeSP]
  );

  const toggleSb = useCallback(() => setSbCollapsed((c) => !c), []);
  const handleBrand = useCallback(() => {
    setSbCollapsed((c) => {
      if (c) return false;
      goto("home");
      return c;
    });
  }, [goto]);

  const openPayModal = useCallback(() => setPayOpen(true), []);
  const closePayModal = useCallback(() => setPayOpen(false), []);

  const openAppDetail = useCallback((ref: string) => {
    if (!APP_DATA[ref]) return;
    setView("apps");
    setDetailRef(ref);
    bump();
  }, []);
  const closeAppDetail = useCallback(() => setDetailRef(null), []);

  // ── Chat ──
  const resetChat = useCallback(() => {
    setMsgs([]);
    setChatGone(false);
    setChatBusy(false);
    setTyping(false);
    setChatTitle("New application");
  }, []);

  const sendMsg = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || chatBusy) return;
      setChatGone(true);
      setChatBusy(true);
      setMsgs((m) => [...m, { role: "user", text }]);
      setTyping(true);
      const delay = 600 + Math.random() * 700;
      setTimeout(() => {
        setTyping(false);
        const reply = fallback(text);
        if (reply && typeof reply === "object") {
          const r = reply as PermitReply;
          setMsgs((m) => [...m, { role: "ai", intro: r.intro, outro: r.outro, card: { type: r.type, key: r.key } }]);
        } else {
          const det = detectP(text);
          setMsgs((m) => {
            const next: ChatMsg[] = [...m, { role: "ai", text: reply as string }];
            // Mirror the prototype: a detected permit surfaces a card in the chat.
            if (det) next.push({ role: "ai", card: { type: det.type, key: det.key } });
            return next;
          });
        }
        setChatBusy(false);
      }, delay);
    },
    [chatBusy]
  );

  // ── Side panel / wizard ──
  const openDetailsPanel = useCallback((type: string, key: string) => {
    setSpPermit({ type, key });
    setSpMode("details");
  }, []);

  const startWizard = useCallback((type: string, key: string) => {
    setWzStep(1);
    setWzData({ permitType: type, permitKey: key });
    setWzSubmitted(false);
    setSpMode("wizard");
    setChatTitle(type + " draft");
    // assistant kicks in with a helper message
    setChatGone(true);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [
        ...m,
        {
          role: "ai",
          text:
            "Great, let's start your **" +
            type +
            "** application. I'll be right here if you have any questions along the way about documents, fees, or anything else. Just ask!",
        },
      ]);
    }, 1500);
  }, []);

  const wzNext = useCallback(() => setWzStep((s) => Math.min(s + 1, 4)), []);
  const wzBack = useCallback(() => setWzStep((s) => Math.max(s - 1, 1)), []);
  const wzSubmit = useCallback(() => {
    const type = wzData.permitType || "Permit";
    const prefix = refPrefixFor(wzData.permitKey);
    const ref = `${prefix}-2024-${refCounter.current++}`;

    // Register the new application so it shows up as a real record — the
    // Applications board and the app-detail page both read from APP_DATA.
    const record: AppRecord = {
      title: `${type} — 42 Maple Avenue`,
      type,
      ref,
      submitted: "Just now",
      status: "in-review",
      badge: "In review",
      badgeClass: "br",
      description: `${type} application for 42 Maple Avenue, submitted through Permitly.`,
      fee: 635.0,
      paid: false,
      outstanding: [],
      comments: [
        {
          author: "Permitly",
          role: "System",
          time: "Just now",
          text: "Application received and assigned for review. Expect an initial completeness check within 1 business day.",
          unread: false,
        },
      ],
    };
    APP_DATA[ref] = record;
    setNewAppRefs((refs) => [...refs, ref]);
    setLastSubmittedRef(ref);
    setWzSubmitted(true);

    // Notify the user in the chat with confirmation + next steps.
    setChatGone(true);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [
        ...m,
        {
          role: "ai",
          text:
            "🎉 Your **" +
            type +
            "** application has been submitted. Your reference number is **" +
            ref +
            "**.\n\n**What happens next**\n- Completeness check — we verify your documents (about 1 business day)\n- Technical review — a reviewer checks your plans (5–8 business days)\n- Decision issued — approval or a change request is sent by email\n\nI'll keep you posted here as it moves through each stage. You can also track it any time under **Applications**.",
        },
      ]);
    }, 900);
  }, [wzData]);

  const value: AppState & { typing: boolean } = {
    view,
    goto,
    openChat,
    navKey: String(navKey),
    sbCollapsed,
    toggleSb,
    handleBrand,
    notifOpen,
    setNotifOpen,
    histOpen,
    setHistOpen,
    payOpen,
    openPayModal,
    closePayModal,
    detailRef,
    openAppDetail,
    closeAppDetail,
    msgs,
    chatGone,
    chatBusy,
    sendMsg,
    resetChat,
    chatTitle,
    openConversation,
    spMode,
    spPermit,
    closeSP,
    startWizard,
    openDetailsPanel,
    wzStep,
    wzData,
    wzNext,
    wzBack,
    wzSubmit,
    wzSubmitted,
    newAppRefs,
    lastSubmittedRef,
    typing,
  };

  return <Ctx.Provider value={value as AppState}>{children}</Ctx.Provider>;
}

// expose typing separately via a thin hook
export function useTyping() {
  const v = useContext(Ctx) as (AppState & { typing?: boolean }) | null;
  return v?.typing ?? false;
}

export { APP_DATA };
export type { AppRecord, Comment };
