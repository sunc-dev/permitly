"use client";

import React from "react";
import { useApp } from "./AppContext";
import { HouseIcon, FilesIcon, CreditCardIcon, FolderOpenIcon, ClockCounterClockwiseIcon, ChatCircleIcon, SidebarSimpleIcon } from "@phosphor-icons/react";

const NAV = [
  { key: "home" as const, label: "Home", icon: <HouseIcon size={16} color="currentColor" /> },
  { key: "apps" as const, label: "Applications", count: "4", icon: <FilesIcon size={16} color="currentColor" /> },
  { key: "payments" as const, label: "Payments", icon: <CreditCardIcon size={16} color="currentColor" /> },
  { key: "records" as const, label: "Records", icon: <FolderOpenIcon size={16} color="currentColor" /> },
];

const HistoryIcon = () => <ClockCounterClockwiseIcon size={16} color="currentColor" />;
const RecentIcon = () => <ChatCircleIcon size={16} color="currentColor" />;

export default function Sidebar() {
  const { view, goto, openConversation, sbCollapsed, toggleSb, handleBrand, setHistOpen } = useApp();

  return (
    <aside className={"sb" + (sbCollapsed ? " collapsed" : "")}>
      <div className="sb-top">
        <div className="sb-brand" onClick={handleBrand}>
          <div className="sb-icon">
            <span className="mark">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="390 255 310 265" width="22" height="22">
                <path
                  fill="#0F1623"
                  d="M413.624268,390.999878 C413.627350,371.007690 413.606079,351.515472 413.642365,332.023346 C413.656708,324.309448 415.709808,322.185455 423.395905,322.142700 C438.882477,322.056580 454.369751,322.094666 469.856720,322.075562 C478.112732,322.065369 478.899292,321.270416 478.918945,312.831635 C478.945740,301.336334 478.898285,289.840546 478.982269,278.345734 C479.049347,269.162018 481.165222,266.999451 490.117432,266.971344 C513.607849,266.897522 537.098755,266.950256 560.588562,266.807556 C565.484985,266.777802 568.857361,268.351929 570.714539,273.122650 C574.276611,282.272705 577.966064,291.376404 581.798706,300.416229 C583.203308,303.729218 583.029297,306.373383 580.403198,308.969879 C573.061951,316.228516 565.888611,323.657990 558.499329,330.866608 C555.453369,333.838135 551.408630,334.230469 547.307495,334.225006 C529.148132,334.200836 510.988739,334.225067 492.829407,334.252899 C481.842957,334.269714 480.386841,335.651459 480.378601,346.516663 C480.346985,388.166626 480.361969,429.816620 480.365326,471.466583 C480.366028,479.976532 479.765991,480.874756 471.711243,483.717377 C456.173981,489.200775 440.640411,494.695160 425.079193,500.109955 C417.211334,502.847717 413.685333,500.307831 413.676147,491.959778 C413.639282,458.473145 413.637665,424.986542 413.624268,390.999878 z"
                />
                <path
                  fill="#0F1623"
                  d="M575.945679,418.946930 C563.673401,431.202820 551.654602,443.212128 539.631165,455.216766 C534.117493,460.721771 530.798157,460.751556 525.311218,455.242859 C514.144714,444.031982 503.045807,432.753448 491.837616,421.584503 C489.062408,418.819031 487.807495,415.753998 487.835236,411.793091 C487.957581,394.303711 487.890289,376.812897 487.861542,359.322662 C487.857056,356.599396 488.055481,353.978302 490.054596,351.869598 C492.845459,348.925720 496.683624,348.951019 500.182129,352.299133 C505.836426,357.710297 511.338898,363.281311 516.861816,368.828217 C522.392029,374.382416 524.943298,374.427643 530.577637,368.828552 C562.710693,336.896454 594.832458,304.953003 626.963623,273.019043 C628.262695,271.727936 629.542847,270.400665 630.961914,269.250946 C634.457947,266.418396 638.026123,266.384094 641.257507,269.602692 C653.412598,281.709412 665.561462,293.823700 677.583679,306.061737 C681.675659,310.227203 681.395081,314.139618 676.847961,318.697876 C668.615540,326.950500 660.199646,335.019684 651.935303,343.240845 C626.670166,368.374146 601.440613,393.543274 575.945679,418.946930 z"
                />
              </svg>
            </span>
            <span className="pnl">
              <SidebarSimpleIcon size={15} color="#0F1623" />
            </span>
          </div>
          <span className="sb-name">Permitly</span>
        </div>
        <button className="sb-toggle" onClick={toggleSb}>
          <SidebarSimpleIcon size={16} color="currentColor" />
        </button>
      </div>

      <nav className="sb-nav">
        {NAV.map((n) => (
          <button
            key={n.key}
            className={"sb-item" + (view === n.key ? " active" : "")}
            onClick={() => goto(n.key)}
          >
            {n.icon}
            <span className="sb-lbl">{n.label}</span>
            {n.count && <span className="sb-count">{n.count}</span>}
          </button>
        ))}

        <div style={{ height: 8 }} />
        <button className="sb-item" onClick={() => setHistOpen(true)}>
          <HistoryIcon />
          <span className="sb-lbl">History</span>
        </button>

        <div className="sb-sep" />
        <p className="sb-group">Recent</p>
        <button className="sb-item sb-recent" onClick={() => openConversation("I want to build a two-storey addition on my house", "Residential addition")}>
          <RecentIcon />
          <span className="sb-lbl">Residential addition</span>
        </button>
        <button className="sb-item sb-recent" onClick={() => openConversation("I want to host a block party on my street", "Block party permit")}>
          <RecentIcon />
          <span className="sb-lbl">Block party permit</span>
        </button>
      </nav>

      <div className="sb-foot">
        <div className="sb-user">
          <div className="sb-ava">JL</div>
          <div className="sb-uinfo">
            <div className="sb-uname">Jamie Lee</div>
            <div className="sb-urole">Resident</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
