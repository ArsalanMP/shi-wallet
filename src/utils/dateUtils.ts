import jalaali from 'jalaali-js';

export const isShamsi15th = (): boolean => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  const shamsiDate = jalaali.toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());
  return shamsiDate.jd === 15;
};

export const getShamsiDaysInMonth = (date: Date): number => {
  const shamsiDate = jalaali.toJalaali(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
  return jalaali.jalaaliMonthLength(shamsiDate.jy, shamsiDate.jm);
};

const shamsiMonths = [
  'Farvardin', 'Ordibehesht', 'Khordad',
  'Tir', 'Mordad', 'Shahrivar',
  'Mehr', 'Aban', 'Azar',
  'Dey', 'Bahman', 'Esfand'
];

export const formatShamsiDate = (dateString: string) => {
  const date = new Date(dateString);
  const { jy, jm, jd } = jalaali.toJalaali(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
  
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${shamsiMonths[jm - 1]} ${jd}, ${jy} at ${hours}:${minutes}`;
};