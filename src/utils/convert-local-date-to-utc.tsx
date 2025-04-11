export const convertLocalDateToUTC = (date: Date) => {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
};
