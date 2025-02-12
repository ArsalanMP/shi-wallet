declare module 'jalaali-js' {
  interface JalaaliDate {
    jy: number;
    jm: number;
    jd: number;
  }

  interface Jalaali {
    toJalaali(gy: number, gm: number, gd: number): JalaaliDate;
    toGregorian(jy: number, jm: number, jd: number): { gy: number; gm: number; gd: number };
    jalaaliMonthLength(jy: number, jm: number): number;
  }

  const jalaali: Jalaali;
  export default jalaali;
}

