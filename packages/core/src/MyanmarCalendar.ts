//Components
import { gregorianToJD } from "./MMComponents/julian";
import { MmDateTime } from "./MMComponents/mmDateTime";
import { toMyanmarDate } from "./MMComponents/adapters";

export { MmDateTime };

export function gregorianToMyanmar(date: Date) {
  const jd = gregorianToJD(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );

  return new MmDateTime(jd);
}

export function gregorianToMyanmarObject(date: Date) {
  return toMyanmarDate(gregorianToMyanmar(date));
}
