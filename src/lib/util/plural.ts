export const plural = (
  count: number,
  singular: string,
  multiple: string,
  include_count: boolean = true
): string => {
  if (include_count) {
    if (count === 1) return `1 ${singular}`;
    return `${count} ${multiple}`;
  }

  if (count === 1) return singular;
  return multiple;
};
