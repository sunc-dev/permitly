"use client";

import React from "react";
import { AppProvider, useApp } from "./AppContext";
import Sidebar from "./Sidebar";
import HomeView from "./HomeView";
import AppsView from "./AppsView";
import PaymentsView from "./PaymentsView";
import RecordsView from "./RecordsView";
import ChatView from "./ChatView";
import SidePanel from "./SidePanel";
import HistoryPanel from "./HistoryPanel";
import PayModal from "./PayModal";

function Main() {
  const { view } = useApp();
  return (
    <div className="app">
      <Sidebar />
      <HistoryPanel />
      <div className="main">
        {view === "home" && <HomeView />}
        {view === "apps" && <AppsView />}
        {view === "payments" && <PaymentsView />}
        {view === "records" && <RecordsView />}
        {view === "chat" && (
          <div className="cpanel" style={{ display: "flex" }}>
            <ChatView />
          </div>
        )}
        <SidePanel />
      </div>
      <PayModal />
    </div>
  );
}

export default function PermitlyApp() {
  return (
    <AppProvider>
      <Main />
    </AppProvider>
  );
}
