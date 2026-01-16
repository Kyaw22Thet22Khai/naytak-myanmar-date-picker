import { describe, it, expect } from "vitest";
import { Calendar } from "../src/Calendar";

describe("Calendar", () => {
  it("should detect leap years", () => {
    expect(Calendar.isLeapYear(2020)).toBe(true);
    expect(Calendar.isLeapYear(1900)).toBe(false);
    expect(Calendar.isLeapYear(2000)).toBe(true);
    expect(Calendar.isLeapYear(2021)).toBe(false);
  });

  it("should return correct days in month", () => {
    expect(Calendar.daysInMonth(2020, 2)).toBe(29);
    expect(Calendar.daysInMonth(2021, 2)).toBe(28);
    expect(Calendar.daysInMonth(2021, 1)).toBe(31);
    expect(Calendar.daysInMonth(2021, 4)).toBe(30);
  });

  it("should validate dates", () => {
    expect(Calendar.isValidDate({ year: 2020, month: 2, day: 29 })).toBe(true);
    expect(Calendar.isValidDate({ year: 2021, month: 2, day: 29 })).toBe(false);
    expect(Calendar.isValidDate({ year: 2021, month: 13, day: 1 })).toBe(false);
    expect(Calendar.isValidDate({ year: 2021, month: 4, day: 31 })).toBe(false);
    expect(Calendar.isValidDate({ year: 2021, month: 4, day: 30 })).toBe(true);
  });
});
