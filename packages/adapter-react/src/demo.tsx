import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { CalendarComponent } from "./CalendarComponent";
import { MyanmarCalendarComponent } from "./MyanmarCalendarComponent";

const App: React.FC = () => {
  const [calendarType, setCalendarType] = useState<"gregorian" | "myanmar">(
    "gregorian"
  );

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16, textAlign: "center" }}>
        <label style={{ marginRight: 8 }}>Calendar Type:</label>
        <select
          value={calendarType}
          onChange={(e) => setCalendarType(e.target.value as any)}>
          <option value="gregorian">Gregorian</option>
          <option value="myanmar">Myanmar</option>
        </select>
      </div>
      {calendarType === "gregorian" ? (
        <CalendarComponent />
      ) : (
        <MyanmarCalendarComponent />
      )}
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
