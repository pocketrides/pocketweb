export const plural = (
  count: number,
  singular: string,
  multiple: string
): string => {
  if (count === 1) return `1 ${singular}`;
  return `${count} ${multiple}`;
};
