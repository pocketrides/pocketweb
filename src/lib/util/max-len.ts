export const maxLen = (str: string, max: number = 120) => {
  if (str.length > max) return str.slice(0, max) + '…';
  return str;
};
