import React, { useMemo, useState } from "react";
import {
  toMyanmarDate,
  gregorianToMyanmar,
  gregorianToMyanmarObject,
} from "@naytak/calendar-core";

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

type MyanmarLunarCompat = {
  myanmarYear: number;
  myanmarMonth: string;
  phase: string;
  day: number;
  watat: boolean;
  monthIndex: number;
};

export interface MyanmarCalendarComponentProps {
  year?: number;
  month?: number; // Gregorian month (1–12)
}

/* ------------------------------------------------------------------ */
/* Constants & Helpers */
/* ------------------------------------------------------------------ */

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatMyanmarDate(lunar: MyanmarLunarCompat): string {
  return `Myanmar Year ${lunar.myanmarYear}, ${lunar.myanmarMonth} ${lunar.phase} ${lunar.day}`;
}

function isSameDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export const MyanmarCalendarComponent: React.FC<
  MyanmarCalendarComponentProps
> = ({ year, month }) => {
  const today = new Date();

  const [viewYear, setViewYear] = useState(year ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(month ?? today.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  /* -------------------- Gregorian Grid -------------------- */

  const weeks = useMemo(() => {
    const firstDay = getFirstDayOfWeek(viewYear, viewMonth);
    const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();

    const cells: (Date | null)[] = [];

    for (let i = 0; i < firstDay; i++) cells.push(null);

    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(new Date(viewYear, viewMonth - 1, d));
    }

    while (cells.length % 7 !== 0) cells.push(null);

    const rows: (Date | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      rows.push(cells.slice(i, i + 7));
    }

    return rows;
  }, [viewYear, viewMonth]);

  /* -------------------- Today Myanmar Date -------------------- */

  function mapCoreToCompat(
    core: ReturnType<typeof gregorianToMyanmar>
  ): MyanmarLunarCompat {
    const d = toMyanmarDate(core);
    return {
      myanmarYear: d.myYear,
      myanmarMonth: d.monthName,
      phase: d.moonPhase,
      day: d.day,
      watat: d.isWatat,
      monthIndex: d.monthIndex,
    };
  }

  const todayLunar = mapCoreToCompat(gregorianToMyanmar(today));

  // Example lunar date for 2026-01-16
  const lunar = toMyanmarDate(gregorianToMyanmar(new Date(2026, 1, 16)));
  console.log(lunar, "Lunar date for 2026-01-16");

  const testDate = gregorianToMyanmar(new Date(2026, 1, 16));
  console.log(testDate.toString(), "Core lunar date for 2026-01-16");

  const test2 = gregorianToMyanmarObject(new Date(2026, 1, 16));
  console.log(test2, "Object lunar date for 2026-01-16");

  /* ------------------------------------------------------------------ */
  /* Render */
  /* ------------------------------------------------------------------ */

  return (
    <div
      style={{
        maxWidth: 360,
        margin: "1rem auto",
        fontFamily: "system-ui, sans-serif",
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 12,
      }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 6,
        }}>
        <button
          onClick={() => setViewMonth(viewMonth === 1 ? 12 : viewMonth - 1)}>
          ‹
        </button>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 600 }}>
            {viewYear} –{" "}
            {new Date(viewYear, viewMonth - 1).toLocaleString("en", {
              month: "long",
            })}
          </div>
          <div style={{ fontSize: 12, color: "#666" }}>
            Myanmar Year {todayLunar.myanmarYear}
          </div>
        </div>

        <button
          onClick={() => setViewMonth(viewMonth === 12 ? 1 : viewMonth + 1)}>
          ›
        </button>
      </div>

      {/* Today */}
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <strong>{formatMyanmarDate(todayLunar)}</strong>
      </div>

      {/* Calendar */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          tableLayout: "fixed",
        }}>
        <thead>
          <tr>
            {WEEKDAYS.map((day) => (
              <th
                key={day}
                style={{
                  padding: 6,
                  fontSize: 12,
                  background: "#f5f5f5",
                  border: "1px solid #ddd",
                }}>
                {day}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((date, di) => {
                const lunar = date
                  ? mapCoreToCompat(gregorianToMyanmar(date))
                  : null;

                const isToday = date && isSameDate(date, today);
                const isSelected =
                  date && selectedDate && isSameDate(date, selectedDate);

                return (
                  <td
                    key={di}
                    onClick={() => date && setSelectedDate(date)}
                    title={lunar ? formatMyanmarDate(lunar) : ""}
                    style={{
                      height: 48,
                      border: "1px solid #ddd",
                      textAlign: "center",
                      cursor: date ? "pointer" : "default",
                      background: isToday
                        ? "#ffe082"
                        : isSelected
                        ? "#90caf9"
                        : "#fff",
                      color: date ? "#000" : "#ccc",
                    }}>
                    {date && (
                      <>
                        <div style={{ fontSize: 13 }}>{date.getDate()}</div>
                        <div style={{ fontSize: 10, color: "#555" }}>
                          {lunar
                            ? lunar.phase === "NewMoon"
                              ? "🌑"
                              : lunar.phase === "FullMoon"
                              ? "🌕"
                              : lunar.phase === "Waxing"
                              ? "🌒"
                              : lunar.phase === "Waning"
                              ? "🌘"
                              : lunar.day
                            : ""}
                        </div>
                      </>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Selected */}
      {selectedDate && (
        <div style={{ marginTop: 10, textAlign: "center" }}>
          <strong>
            {formatMyanmarDate(
              mapCoreToCompat(gregorianToMyanmar(selectedDate))
            )}
          </strong>
        </div>
      )}
    </div>
  );
};
