import React, { useState } from "react";
import { Calendar, CalendarDate } from "@naytak/calendar-core";

export interface CalendarComponentProps {
  year?: number;
  month?: number; // 1-12
}

export const CalendarComponent: React.FC<CalendarComponentProps> = ({
  year,
  month,
}: CalendarComponentProps) => {
  const today = Calendar.today();
  const [viewYear, setViewYear] = useState(year || today.year);
  const [viewMonth, setViewMonth] = useState(month || today.month);
  const [selected, setSelected] = useState<CalendarDate | null>(null);

  // Use core utilities for matrix, navigation, labels, weekdays
  const monthMatrix = Calendar.getMonthMatrix(viewYear, viewMonth);
  const weekdays = Calendar.getWeekdays();
  const monthLabel = Calendar.getMonthLabel(viewYear, viewMonth);

  return (
    <div
      style={{
        maxWidth: 350,
        margin: "1em auto",
        fontFamily: "sans-serif",
      }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}>
        <button
          onClick={() => {
            const prev = Calendar.getPrevMonth(viewYear, viewMonth);
            setViewYear(prev.year);
            setViewMonth(prev.month);
          }}>
          &lt;
        </button>
        <h2 style={{ textAlign: "center", margin: 0 }}>{monthLabel}</h2>
        <button
          onClick={() => {
            const next = Calendar.getNextMonth(viewYear, viewMonth);
            setViewYear(next.year);
            setViewMonth(next.month);
          }}>
          &gt;
        </button>
      </div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}>
        <thead>
          <tr>
            {weekdays.map((wd) => (
              <th
                key={wd}
                style={{
                  border: "1px solid #888",
                  padding: "4px",
                  background: "#f0f0f0",
                }}>
                {wd}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {monthMatrix.map((week, i) => (
            <tr key={i}>
              {week.map((date, j) => (
                <td
                  key={j}
                  style={{
                    border: "1px solid #888",
                    padding: "8px",
                    textAlign: "center",
                    background: date
                      ? Calendar.isSameDate(
                          date,
                          selected || { year: -1, month: -1, day: -1 }
                        )
                        ? "#90caf9" // highlight selected
                        : "#fff"
                      : "#f9f9f9",
                    color: date ? "#222" : "#ccc",
                    fontWeight:
                      date && Calendar.isSameDate(date, today)
                        ? "bold"
                        : "normal",
                    cursor: date ? "pointer" : "default",
                  }}
                  onClick={() => date && setSelected(date)}>
                  {date ? date.day : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {selected && (
        <div style={{ marginTop: 12, textAlign: "center" }}>
          Selected: {selected.year} / {selected.month} / {selected.day}
        </div>
      )}
    </div>
  );
};
