import { gregorianToMyanmarLunar } from "../MyanmarCalendar";

describe("Myanmar lunar conversion", () => {
  it("should return correct Myanmar date for 2026-01-15", () => {
    const result = gregorianToMyanmarLunar(2026, 1, 15);
    expect(result.myanmarYear).toBe(1387);
    expect(result.myanmarMonth).toBe("Pyatho");
    expect(result.phase).toBe("Waning");
    expect(result.day).toBe(13);
  });
});
