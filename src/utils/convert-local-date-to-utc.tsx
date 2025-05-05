// change local datetime to UTC datetime
export const convertLocalDateToUTC = (date: Date) => {
  const d = new Date(date);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000);
};
