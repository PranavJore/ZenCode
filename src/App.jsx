
import { useState, useEffect } from "react";

import FloatingButton from "./components/FloatingButton";
import Header from "./components/Header";
import SettingsView from "./components/SettingsView";
import ReportView from "./components/ReportView";
import VideoSolutions from "./components/VideoSolutions";

import { startTracking } from "./utils/tracker";
import {
  DEFAULT_UI_THEME,
  saveUiTheme,
  onUiThemeChange,
} from "./utils/settings";

function App({ initialUiTheme = DEFAULT_UI_THEME }) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("report");
  const [uiTheme, setUiTheme] = useState(initialUiTheme);

  useEffect(() => {
    startTracking();
  }, []);

  // Follow theme changes made in other LeetCode tabs.
  useEffect(() => onUiThemeChange(setUiTheme), []);

  function changeUiTheme(nextTheme) {
    setUiTheme(nextTheme);
    saveUiTheme(nextTheme);
  }

  return (
    // Light-mode palette overrides in index.css are scoped to this attribute.
    <div data-ui-theme={uiTheme}>
      {open ? (
        <Panel
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onClose={() => setOpen(false)}
          uiTheme={uiTheme}
          onUiThemeChange={changeUiTheme}
        />
      ) : (
        // Display the floating button when the panel is closed.
        <FloatingButton
          onClick={() => setOpen(true)}
        />
      )}
    </div>
  );
}

function Panel({
  activeTab,
  setActiveTab,
  onClose,
  uiTheme,
  onUiThemeChange,
}) {
  return (
    <div
      className="
        fixed bottom-6 right-6
        z-[999999]
        w-[26rem]
        max-h-[80vh]
        rounded-2xl
        bg-gradient-to-br
        from-gray-900/90
        to-gray-800/90
        backdrop-blur-xl
        border border-gray-700/60
        shadow-[0_20px_60px_rgba(0,0,0,0.6)]
        flex flex-col
        overflow-hidden
        font-sans
        text-gray-200
      "
    >
      {/* Header and Navigation */}
      <Header
        onClose={onClose}
        activeTab={activeTab}
        onReport={() => setActiveTab("report")}
        onVideos={() => setActiveTab("videos")}
        onSettings={() => {
          setActiveTab(
            activeTab === "settings"
              ? "report"
              : "settings"
          );
        }}
      />

      {/* Main Content */}
      <div
        className="
          px-4 py-4
          flex-1
          overflow-y-auto
          scrollbar-thin
          scrollbar-thumb-gray-700/60
          scrollbar-track-transparent
        "
      >
        {activeTab === "report" && (
          <ReportView />
        )}

        {activeTab === "videos" && (
          <VideoSolutions />
        )}

        {activeTab === "settings" && (
          <SettingsView
            uiTheme={uiTheme}
            onUiThemeChange={onUiThemeChange}
          />
        )}
      </div>

      {/* Footer */}
      <div
        className="
          px-3 py-2
          text-center
          text-xs
          text-gray-400
          border-t border-gray-800
          font-mono
        "
      >
        LeetBoost • v1.0
      </div>
    </div>
  );
}

export default App;
