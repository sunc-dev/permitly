"use client";

import React, { useEffect, useRef, useState } from "react";
import { useApp } from "./AppContext";
import { CHIPS } from "@/lib/data";
import { fmt } from "@/lib/format";
import { Sparkle, Plus, Paperclip, ImageIcon, Send } from "./Icons";
import PermitCard from "./PermitCard";

interface InputBoxProps {
  taRef: React.RefObject<HTMLTextAreaElement | null>;
  placeholder: string;
  draft: string;
  setDraft: (v: string) => void;
  autoResize: (el: HTMLTextAreaElement) => void;
  onKey: (e: React.KeyboardEvent) => void;
  submit: () => void;
}

function InputBox({ taRef, placeholder, draft, setDraft, autoResize, onKey, submit }: InputBoxProps) {
  return (
    <div className="input-box">
      <textarea
        ref={taRef}
        className="chat-ta"
        placeholder={placeholder}
        rows={1}
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          autoResize(e.target);
        }}
        onKeyDown={onKey}
      />
      <div className="input-foot">
        <div className="input-icons">
          <button className="ico-btn">
            <Paperclip size={14} />
          </button>
          <button className="ico-btn">
            <ImageIcon size={14} />
          </button>
        </div>
        <button className="send-btn" onClick={submit} disabled={draft.trim().length === 0}>
          <Send size={12} />
        </button>
      </div>
    </div>
  );
}

export default function ChatView() {
  const { msgs, chatGone, chatBusy, sendMsg, resetChat, chatTitle, typing } = useApp() as ReturnType<typeof useApp> & { typing: boolean };
  const [draft, setDraft] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);
  const taTop = useRef<HTMLTextAreaElement>(null);
  const taBottom = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, typing]);

  useEffect(() => {
    if (chatGone) taBottom.current?.focus();
    else taTop.current?.focus();
  }, [chatGone]);

  const submit = () => {
    if (!draft.trim() || chatBusy) return;
    sendMsg(draft);
    setDraft("");
    if (taTop.current) taTop.current.style.height = "auto";
    if (taBottom.current) taBottom.current.style.height = "auto";
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };
  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  const reset = () => {
    resetChat();
    setDraft("");
  };

  const inputProps = { draft, setDraft, autoResize, onKey, submit };

  return (
    <div className="chat-view active" id="view-chat">
      <div className="chat-tbar" style={{ position: "relative" }}>
        <span className="chat-tbar-title">{chatTitle}</span>
        <div className="chat-tbar-right">
          <button className="btn btn-ghost m3-body-small" onClick={reset} style={{ padding: "5px 12px" }}>
            <Plus stroke="currentColor" />
            New
          </button>
        </div>
      </div>
      <div className="chat-body" ref={bodyRef}>
        {!chatGone && (
          <div className="chat-empty">
            <div className="c-icon">
              <Sparkle size={24} fill="var(--fg)" />
            </div>
            <div className="c-title">What do you need a permit for?</div>
            <div className="c-sub">Describe your project and I&apos;ll tell you what you need.</div>
            <div className="input-wrap" style={{ marginTop: 20 }}>
              <InputBox taRef={taTop} placeholder="Ask anything, use @ to tag permit types" {...inputProps} />
              <div className="chips-row">
                <span className="chips-lbl">Suggestions:</span>
                <div className="chips">
                  {CHIPS.map((c, i) => (
                    <div className="chip" key={i} onClick={() => sendMsg(c.prompt)}>
                      {c.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {chatGone && (
          <div className="msg-list" style={{ display: "flex" }}>
            {msgs.map((m, i) => (
              <div className={"msg-row " + m.role} key={i}>
                <div className="msg-ava">{m.role === "ai" ? <Sparkle /> : "JL"}</div>
                <div className="msg-bub" style={m.card ? { maxWidth: "88%" } : undefined}>
                  {m.text !== undefined && fmt(m.text)}
                  {m.intro !== undefined && fmt(m.intro)}
                  {m.card && <PermitCard type={m.card.type} permitKey={m.card.key} />}
                  {m.outro !== undefined && fmt(m.outro)}
                </div>
              </div>
            ))}
            {typing && (
              <div className="typing-row">
                <div className="msg-ava" style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--fg)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Sparkle />
                </div>
                <div className="typing-dots">
                  <div className="t-dot" />
                  <div className="t-dot" />
                  <div className="t-dot" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {chatGone && (
        <div className="chat-input-bottom" style={{ display: "block" }}>
          <InputBox taRef={taBottom} placeholder="Ask anything…" {...inputProps} />
        </div>
      )}
    </div>
  );
}
