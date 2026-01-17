/**
 * MyanmarCalendarComponent
 *
 * A reusable React calendar component for displaying Myanmar lunar dates.
 *
 * Props:
 * - year?: number  // Gregorian year (optional, controlled)
 * - month?: number // Gregorian month (1–12, optional, controlled)
 * - onChange?: (date: Date) => void // Called when a date is selected
 *
 * Usage:
 * import MyanmarCalendarComponent from "naytak-myanmar-react-calendar";
 * <MyanmarCalendarComponent onChange={(date) => setDate(date)} />
 */

import React, { useMemo, useState, useEffect } from "react";

// CSS
import "./CSS/MyanmarCalendarComponent.css";

// Calendar Core
import { toMyanmarDate, gregorianToMyanmar } from "naytak-calendar-core";

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

// Myanmar month names (Unicode)
// Myanmar month names (English key, Unicode value)
const MYANMAR_MONTHS: { [key: string]: string } = {
  Waso: "ဝါဆို",
  Tagu: "တန်ခူး",
  Kason: "ကဆုန်",
  Nayon: "နယုန်",
  SecondWaso: "ဒုတိယ ဝါဆို",
  Wagaung: "ဝါခေါင်",
  Tawthalin: "တော်သလင်း",
  Thadingyut: "သီတင်းကျွတ်",
  Tazaungmon: "တန်ဆောင်မုန်း",
  Nadaw: "နတ်တော်",
  Pyatho: "ပြာသို",
  Tabodwe: "တပို့တွဲ",
  Tabaung: "တပေါင်း",
  LateTagu: "နောက်တန်ခူး",
  LateKason: "နောက်ကဆုန်",
};

const MYANMAR_PHASES: Record<string, string> = {
  Waxing: "လဆန်း",
  Waning: "လဆုတ်",
  "Full Moon": "လပြည့်",
  "New Moon": "လကွယ်",
};

type MyanmarLunarCompat = {
  myanmarYear: number;
  myanmarMonth: string;
  phase: "Waxing" | "Waning" | "Full Moon" | "New Moon";
  day: number;
  watat: boolean;
  monthIndex: number;
};

export interface MyanmarCalendarComponentProps {
  year?: number;
  month?: number; // Gregorian month (1–12)
  onChange?: (result: { gregorian: Date; myanmar: MyanmarLunarCompat }) => void; // Called when a date is selected
}

/* ------------------------------------------------------------------ */
/* Constants & Helpers */
/* ------------------------------------------------------------------ */

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toMyanmarNumber(input: number | string): string {
  const myDigits = ["၀", "၁", "၂", "၃", "၄", "၅", "၆", "၇", "၈", "၉"];
  return input
    .toString()
    .split("")
    .map((d) => (/\d/.test(d) ? myDigits[parseInt(d)] : d))
    .join("");
}

function formatMyanmarDate(lunar: MyanmarLunarCompat): string {
  const showDay = lunar.phase === "Waxing" || lunar.phase === "Waning";
  return (
    `မြန်မာနှစ် ${toMyanmarNumber(lunar.myanmarYear)}၊ ${
      MYANMAR_MONTHS[lunar.myanmarMonth]
    } ` +
    `${MYANMAR_PHASES[lunar.phase]}${
      showDay ? ` ${toMyanmarNumber(lunar.day)}` : ""
    }`
  );
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

function mapCoreToCompat(date: Date): MyanmarLunarCompat {
  const d = toMyanmarDate(gregorianToMyanmar(date));
  return {
    myanmarYear: d.myYear,
    myanmarMonth: d.monthName,
    phase: d.moonPhase as MyanmarLunarCompat["phase"],
    day: d.day,
    watat: d.isWatat,
    monthIndex: d.monthIndex,
  };
}

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

const MyanmarCalendarComponent: React.FC<MyanmarCalendarComponentProps> = ({
  year,
  month,
  onChange,
}) => {
  const today = new Date();

  // State
  const [viewYear, setViewYear] = useState(year ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(month ?? today.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const todayLunar = mapCoreToCompat(today);

  // Sync state with props if they change
  useEffect(() => {
    if (year !== undefined) setViewYear(year);
  }, [year]);
  useEffect(() => {
    if (month !== undefined) setViewMonth(month);
  }, [month]);

  // Gregorian Grid
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

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    if (onChange) onChange({ gregorian: date, myanmar: mapCoreToCompat(date) });
  };

  // Render
  return (
    <div className="myanmar-calendar-root">
      {/* Gregorian Filters */}
      <div className="myanmar-calendar-filters">
        {/* Gregorian Year Select */}
        <select
          value={viewYear}
          onChange={(e) => {
            const y = +e.target.value;
            setViewYear(y);
            setSelectedDate(
              new Date(
                y,
                viewMonth - 1,
                selectedDate ? selectedDate.getDate() : 1,
              ),
            );
          }}
          className="myanmar-calendar-select">
          {Array.from({ length: 100 }, (_, i) => today.getFullYear() - i).map(
            (y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ),
          )}
        </select>

        {/* Gregorian Month Select */}
        <select
          value={viewMonth}
          onChange={(e) => {
            const m = +e.target.value;
            setViewMonth(m);
            setSelectedDate(
              new Date(
                viewYear,
                m - 1,
                selectedDate ? selectedDate.getDate() : 1,
              ),
            );
          }}
          className="myanmar-calendar-select">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              {new Date(2000, m - 1, 1).toLocaleString("en", { month: "long" })}
            </option>
          ))}
        </select>

        {/* Gregorian Day Select */}
        <select
          value={selectedDate ? selectedDate.getDate() : 1}
          onChange={(e) => {
            const d = +e.target.value;
            const newDate = new Date(viewYear, viewMonth - 1, d);
            setSelectedDate(newDate);
            if (onChange)
              onChange({
                gregorian: newDate,
                myanmar: mapCoreToCompat(newDate),
              });
          }}
          className="myanmar-calendar-select">
          {Array.from(
            { length: new Date(viewYear, viewMonth, 0).getDate() },
            (_, i) => i + 1,
          ).map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Today */}
      <div className="myanmar-calendar-today">
        Today: {today.toLocaleDateString()}
        <br />
        <span className="myanmar-calendar-today-lunar">
          {formatMyanmarDate(todayLunar)}
        </span>
      </div>
      {/* Calendar */}
      <table className="myanmar-calendar-table">
        <thead>
          <tr>
            {WEEKDAYS.map((d) => (
              <th key={d} className="myanmar-calendar-th">
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, i) => (
            <tr key={i}>
              {week.map((date, j) => {
                if (!date)
                  return (
                    <td
                      key={j}
                      className="myanmar-calendar-td myanmar-calendar-td-empty"
                    />
                  );

                const lunar = mapCoreToCompat(date);
                const isToday = isSameDate(date, today);
                const isSelected =
                  selectedDate && isSameDate(date, selectedDate);

                let tdClass = "myanmar-calendar-td";
                if (isSelected) tdClass += " myanmar-calendar-td-selected";
                else if (isToday) tdClass += " myanmar-calendar-td-today";

                return (
                  <td
                    key={j}
                    onClick={() => handleDateSelect(date)}
                    className={tdClass}
                    title={formatMyanmarDate(lunar)}>
                    <div className="myanmar-calendar-date">
                      {date.getDate()}
                    </div>
                    <div className="myanmar-calendar-lunar">
                      {MYANMAR_MONTHS[lunar.myanmarMonth]}{" "}
                      {MYANMAR_PHASES[lunar.phase]}{" "}
                      {lunar.phase === "Waxing" || lunar.phase === "Waning"
                        ? toMyanmarNumber(lunar.day)
                        : ""}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Selected Date Info */}
      {selectedDate && (
        <div className="myanmar-calendar-selected-info">
          <strong>Selected: {selectedDate.toLocaleDateString()}</strong>
          <div className="myanmar-calendar-selected-lunar">
            {formatMyanmarDate(mapCoreToCompat(selectedDate))}
          </div>
        </div>
      )}
    </div>
  );
};

// Export as named export for easier named import in other projects
export { MyanmarCalendarComponent };
