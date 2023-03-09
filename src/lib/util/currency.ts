export const formatCents = (cents: number): string => {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency'
  }).format(cents / 100);
};
