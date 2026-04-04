export const CURRENCIES = [
  { code: 'USD', symbol: '$', rate: 1 },
  { code: 'EUR', symbol: '€', rate: 0.92 },
  { code: 'GBP', symbol: '£', rate: 0.79 },
  { code: 'INR', symbol: '₹', rate: 83.5 },
  { code: 'JPY', symbol: '¥', rate: 151.2 }
];

export const formatCurrency = (amount, currencyObj = CURRENCIES[0]) => {
  const converted = amount * currencyObj.rate;
  return `${currencyObj.symbol}${Math.abs(converted).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
