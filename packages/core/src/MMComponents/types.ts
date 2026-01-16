export type MoonPhase = "NewMoon" | "Waxing" | "FullMoon" | "Waning";

export interface MyanmarDate {
  myYear: number;
  monthIndex: number;
  monthName: string;
  day: number;
  moonPhase: MoonPhase;
  fortnightDay: number;
  isWatat: boolean;
}
