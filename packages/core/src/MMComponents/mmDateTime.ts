/* ============================================================
 * Myanmar Calendar (mmcal)
 * Exact TypeScript port of MmDateTime.js
 * Author: Yan Naing Aye
 * ============================================================
 */

// MmDateTime.ts
export class MmDateTime {
  static readonly SY = 1577917828 / 4320000;
  static readonly LM = 1577917828 / 53433336;
  static readonly MO = 1954168.050623;

  my = 0;
  mm = 0;
  md = 0;
  mp = 0;
  mf = 0;
  watat = 0;
  bw = 0;

  jd: number;

  constructor(jd: number) {
    this.jd = jd;
    this.calcMyanmarDate();
  }

  static mod(a: number, b: number) {
    return a - Math.floor(a / b) * b;
  }

  static calWatat(my: number) {
    const ed = MmDateTime.mod(MmDateTime.SY * (my + 3739), MmDateTime.LM);
    return {
      watat: ed < 2 ? 1 : 0,
      bw: ed < 1 ? 1 : 0,
    };
  }

  static calMy(my: number) {
    let yd = 0;
    let y2;
    do {
      yd++;
      y2 = MmDateTime.calWatat(my - yd);
    } while (y2.watat === 0);

    const fm = Math.round(
      MmDateTime.SY * (my + 3739) -
        MmDateTime.LM *
          Math.round((MmDateTime.SY * (my + 3739)) / MmDateTime.LM)
    );

    const y1 = MmDateTime.calWatat(my);

    return {
      my,
      watat: y1.watat,
      bw: y1.bw,
      tg1: Math.round(MmDateTime.MO + MmDateTime.SY * my - fm),
    };
  }

  calcMyanmarDate(): void {
    // 1️⃣ Round Julian Day
    const jd = Math.floor(this.jd + 0.5);

    // 2️⃣ Myanmar year index
    const my = Math.floor((jd - MmDateTime.MO) / MmDateTime.SY);

    // 3️⃣ Myanmar year info
    const yo = MmDateTime.calMy(my);

    // 4️⃣ Day offset in Myanmar year
    let dd = jd - yo.tg1 + 1;

    // 5️⃣ Initialize month index (0-based) and day
    let mm = 0;
    let md = dd;

    // 6️⃣ Compute month using integer arithmetic (official mmcal)
    // Month lengths alternate 29 and 30, adjusted for Watat (leap month)
    const isWatat = yo.watat === 1;
    const monthLengths: number[] = [
      30,
      29,
      30,
      29, // Tagu → Waso
      ...(isWatat ? [30, 29] : []), // Second Waso in Watat years
      30,
      29,
      30,
      29,
      30,
      29,
      30,
      29,
      30,
      29,
      30,
      29, // rest of months
    ];

    while (md > monthLengths[mm]) {
      md -= monthLengths[mm];
      mm++;
    }

    // 7️⃣ Waxing / Waning and Full Moon / New Moon
    let mp, mf, dayInFortnight;
    if (md <= 15) {
      mp = 0; // Waxing
      mf = md === 15 ? 1 : 0; // Full Moon
      dayInFortnight = md;
    } else {
      mp = 1; // Waning
      mf = md === monthLengths[mm] ? 1 : 0; // New Moon on last day of month
      dayInFortnight = md - 15;
    }

    // 8️⃣ Assign to class
    this.my = my; // Myanmar Era year
    this.mm = mm + 2; // 0-based month index
    this.md = dayInFortnight; // day in fortnight
    this.mp = mp; // 0 = Waxing, 1 = Waning
    this.mf = mf; // 1 = FullMoon/NewMoon
    this.watat = yo.watat;
    this.bw = yo.bw;
  }

  getMonthName() {
    const months = [
      "Tagu",
      "Kason",
      "Nayon",
      "Waso",
      "Second Waso",
      "Wagaung",
      "Tawthalin",
      "Thadingyut",
      "Tazaungmon",
      "Nadaw",
      "Pyatho",
      "Tabodwe",
      "Tabaung",
    ];
    return months[this.mm] || "";
  }

  getMoonPhase() {
    if (this.mf === 1) return "Full Moon";
    return this.mp === 0 ? "Waxing" : "Waning";
  }

  toString() {
    return `${this.my} ${this.getMonthName()} ${this.getMoonPhase()} ${
      this.md
    }`;
  }
}
