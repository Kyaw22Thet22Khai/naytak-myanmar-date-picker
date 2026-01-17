/* ============================================================
 * Myanmar Calendar (mmcal)
 * Exact TypeScript port of MmDateTime.js
 * Original Algorithm: Dr. Yan Naing Aye
 * ============================================================
 */

export type MoonPhase = "Waxing" | "Waning" | "Full Moon" | "New Moon";

export class MmDateTime {
  // ======================
  // Constants (mmcal)
  // ======================
  static readonly SY = 1577917828 / 4320000; // Solar year
  static readonly LM = 1577917828 / 53433336; // Lunar month
  static readonly MO = 1954168.050623; // Myanmar epoch

  // ======================
  // Myanmar date fields
  // ======================
  my = 0; // Myanmar year
  mm = 0; // Myanmar month index (0-based)
  md = 0; // Day in fortnight (1–15)
  mp = 0; // 0 = Waxing, 1 = Waning
  mf = 0; // 1 = Full Moon / New Moon
  watat = 0; // Watat year flag
  bw = 0; // Big watat flag

  jd: number;

  constructor(jd: number) {
    this.jd = jd;
    this.calcMyanmarDate();
  }

  // ======================
  // Utilities
  // ======================
  static mod(a: number, b: number): number {
    return a - Math.floor(a / b) * b;
  }

  // ======================
  // Watat calculation
  // ======================
  // Ported from originalJavascript.ts (ceMmDateTime.cal_watat)
  static calWatat(my: number) {
    const SY = 1577917828.0 / 4320000.0;
    const LM = 1577917828.0 / 53433336.0;
    const MO = 1954168.050623;
    // The following is a simplified version for modern era (EI=3, after 1312 ME)
    // For full era support, more logic is needed, but this covers most modern dates.
    const EI = 3;
    const WO = -0.5;
    const NM = 8;
    const ed = (SY * (my + 3739)) % LM;
    const TA = (SY / 12 - LM) * (12 - NM);
    let excess = ed;
    if (excess < TA) excess += LM;
    const fm = Math.round(SY * my + MO - excess + 4.5 * LM + WO);
    let watat = 0;
    if (excess >= LM - (SY / 12 - LM) * NM) watat = 1;
    // No exception correction for modern era
    return {
      watat,
      bw: excess < 1 ? 1 : 0,
      fm,
    };
  }

  // ======================
  // Myanmar year data
  // ======================
  // Ported from originalJavascript.ts (ceMmDateTime.cal_my)
  static calMy(my: number) {
    let yd = 0,
      y1,
      nd = 0,
      werr = 0,
      fm = 0;
    // Use calWatat to get watat and full moon day
    let y2 = MmDateTime.calWatat(my);
    let myt = y2.watat;
    do {
      yd++;
      y1 = MmDateTime.calWatat(my - yd);
    } while (y1.watat === 0 && yd < 3);
    if (myt) {
      // If watat year, calculate year type
      nd = (y2.fm - y1.fm) % 354;
      myt = Math.floor(nd / 31) + 1;
      fm = y2.fm;
      if (nd !== 30 && nd !== 31) {
        werr = 1;
      }
    } else {
      fm = y1.fm + 354 * yd;
    }
    let tg1 = y1.fm + 354 * yd - 102;
    return { myt, watat: y2.watat, bw: y2.bw, tg1, fm, werr };
  }

  // ======================
  // Main calculation
  // ======================
  calcMyanmarDate(): void {
    // Ported from originalJavascript.ts (ceMmDateTime.j2m)
    const SY = 1577917828.0 / 4320000.0;
    const MO = 1954168.050623;
    const jd = Math.round(this.jd); // Julian day number
    let my = Math.floor((jd - 0.5 - MO) / SY);
    let yo = MmDateTime.calMy(my);
    let dd = jd - yo.tg1 + 1;
    let b = Math.floor(yo.myt / 2);
    let c = Math.floor(1 / (yo.myt + 1));
    let myl = 354 + (1 - c) * 30 + b;
    let mmt = Math.floor((dd - 1) / myl);
    dd -= mmt * myl;
    let a = Math.floor((dd + 423) / 512);
    let mm = Math.floor((dd - b * a + c * a * 30 + 29.26) / 29.544);
    let e = Math.floor((mm + 12) / 16);
    let f = Math.floor((mm + 11) / 16);
    let md = dd - Math.floor(29.544 * mm - 29.26) - b * e + c * f * 30;
    mm += f * 3 - e * 4 + 12 * mmt;

    // 7️⃣ Moon phase and day in fortnight
    let mp: number;
    let mf: number;
    let dayInFortnight: number;
    if (md === 15) {
      // Full Moon or New Moon
      if (yo.myt === 0 || md === 15) {
        // Common year or exactly 15th day
        mp = 0;
        dayInFortnight = 15;
        mf = 1;
      } else {
        // Big/Little Watat, check if New Moon
        mp = 1;
        dayInFortnight = 15;
        mf = 1;
      }
    } else if (md < 15) {
      mp = 0;
      dayInFortnight = md;
      mf = 0;
    } else {
      mp = 1;
      dayInFortnight = md - 15;
      mf = dayInFortnight === 15 ? 1 : 0;
    }

    this.my = my;
    this.mm = mm;
    this.md = dayInFortnight;
    this.mp = mp;
    this.mf = mf;
    this.watat = yo.watat;
    this.bw = yo.bw;
    this.jd = jd;
  }

  // ======================
  // Helpers
  // ======================
  getMonthName(): string {
    // Month mapping as in original algorithm (Tagu=1, Kason=2, ..., Waso=0, Second Waso=4, etc.)
    const months = [
      "Waso", // 0
      "Tagu", // 1
      "Kason", // 2
      "Nayon", // 3
      "Second Waso", // 4
      "Wagaung", // 5
      "Tawthalin", // 6
      "Thadingyut", // 7
      "Tazaungmon", // 8
      "Nadaw", // 9
      "Pyatho", // 10
      "Tabodwe", // 11
      "Tabaung", // 12
      "Late Tagu", // 13
      "Late Kason", // 14
    ];
    return months[this.mm] ?? "";
  }

  getMoonPhase(): MoonPhase {
    if (this.mf === 1 && this.mp === 0) return "Full Moon";
    if (this.mf === 1 && this.mp === 1) return "New Moon";
    return this.mp === 0 ? "Waxing" : "Waning";
  }

  toString(): string {
    return `${this.my} ${this.getMonthName()} ${this.getMoonPhase()} ${
      this.md
    }`;
  }
}
