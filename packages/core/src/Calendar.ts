/**
 * Basic calendar logic for Naytak Calendar Core
 */

export interface CalendarDate {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
}

export class Calendar {
  /** Returns true if the given year is a leap year */
  static isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  /** Returns the number of days in a given month/year */
  static daysInMonth(year: number, month: number): number {
    if (month === 2) {
      return Calendar.isLeapYear(year) ? 29 : 28;
    }
    return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
  }

  /** Validates a calendar date */
  static isValidDate(date: CalendarDate): boolean {
    const { year, month, day } = date;
    if (month < 1 || month > 12) return false;
    const days = Calendar.daysInMonth(year, month);
    return day >= 1 && day <= days;
  }

  /** Returns today's date as CalendarDate */
  static today(): CalendarDate {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
    };
  }

  /** Adds n days to a CalendarDate and returns the new date */
  static addDays(date: CalendarDate, n: number): CalendarDate {
    const jsDate = new Date(date.year, date.month - 1, date.day + n);
    return {
      year: jsDate.getFullYear(),
      month: jsDate.getMonth() + 1,
      day: jsDate.getDate(),
    };
  }

  /** Returns the day of the week for a CalendarDate (0=Sun, 6=Sat) */
  static getDayOfWeek(date: CalendarDate): number {
    return new Date(date.year, date.month - 1, date.day).getDay();
  }

  /** Returns all dates in the week of the given date (Sunday to Saturday) */
  static getWeek(date: CalendarDate): CalendarDate[] {
    const dayOfWeek = Calendar.getDayOfWeek(date);
    const week: CalendarDate[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(Calendar.addDays(date, i - dayOfWeek));
    }
    return week;
  }

  /** Returns all dates in the given month */
  static getMonthDates(year: number, month: number): CalendarDate[] {
    const days = Calendar.daysInMonth(year, month);
    const dates: CalendarDate[] = [];
    for (let day = 1; day <= days; day++) {
      dates.push({ year, month, day });
    }
    return dates;
  }

  /** Returns a matrix (array of weeks) for the month, each week is an array of CalendarDate|null */
  static getMonthMatrix(
    year: number,
    month: number
  ): Array<CalendarDate | null>[] {
    const monthDates = Calendar.getMonthDates(year, month);
    const firstDayOfWeek = Calendar.getDayOfWeek(monthDates[0]);
    const days: (CalendarDate | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    days.push(...monthDates);
    while (days.length % 7 !== 0) days.push(null);
    const weeks: Array<CalendarDate | null>[] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  }

  /** Returns previous month/year */
  static getPrevMonth(
    year: number,
    month: number
  ): { year: number; month: number } {
    return month === 1
      ? { year: year - 1, month: 12 }
      : { year, month: month - 1 };
  }

  /** Returns next month/year */
  static getNextMonth(
    year: number,
    month: number
  ): { year: number; month: number } {
    return month === 12
      ? { year: year + 1, month: 1 }
      : { year, month: month + 1 };
  }

  /** Returns a label for the month (e.g., 'January 2026') */
  static getMonthLabel(year: number, month: number): string {
    const MONTHS = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${MONTHS[month - 1]} ${year}`;
  }

  /** Returns weekday names (e.g., ['Sun', 'Mon', ...]) */
  static getWeekdays(): string[] {
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  }

  /** Checks if two CalendarDate objects are the same date */
  static isSameDate(a: CalendarDate, b: CalendarDate): boolean {
    return a.year === b.year && a.month === b.month && a.day === b.day;
  }

  /** Returns all dates in a range (inclusive) */
  static getDaysInRange(
    start: CalendarDate,
    end: CalendarDate
  ): CalendarDate[] {
    const result: CalendarDate[] = [];
    let current = start;
    while (
      current.year < end.year ||
      (current.year === end.year && current.month < end.month) ||
      (current.year === end.year &&
        current.month === end.month &&
        current.day <= end.day)
    ) {
      result.push(current);
      current = Calendar.addDays(current, 1);
    }
    return result;
  }
}
