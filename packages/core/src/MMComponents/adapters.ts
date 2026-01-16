import { MmDateTime } from "./mmDateTime";

export function toMyanmarDate(mm: MmDateTime) {
  return {
    myYear: mm.my, // mm.my is already Myanmar Era (should be 1387 for 2026)
    monthIndex: mm.mm - 1, // zero-based for consistency
    monthName: mm.getMonthName(),
    day: mm.md,
    moonPhase: mm.getMoonPhase(),
    fortnightDay: mm.md,
    isWatat: mm.watat === 1,
  };
}
