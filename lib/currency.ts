const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  CHF: 0.88,
  INR: 83.12,
  AUD: 1.53,
  CAD: 1.36,
  CNY: 7.24,
  HKD: 7.82,
  SGD: 1.34,
  AED: 3.67,
};

export type CurrencyCode = keyof typeof EXCHANGE_RATES;

export const SUPPORTED_CURRENCIES = Object.keys(EXCHANGE_RATES) as CurrencyCode[];

export function convertPrice(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  const from = EXCHANGE_RATES[fromCurrency] || 1;
  const to = EXCHANGE_RATES[toCurrency] || 1;
  const usdAmount = amount / from;
  return Math.round(usdAmount * to * 100) / 100;
}

export function formatPrice(amount: number | null, currency: string): string {
  if (amount === null) return 'Price on request';
  
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CHF: 'CHF ',
    INR: '₹',
    AUD: 'A$',
    CAD: 'C$',
    CNY: '¥',
    HKD: 'HK$',
    SGD: 'S$',
    AED: 'AED ',
  };
  
  const symbol = symbols[currency] || currency + ' ';
  
  if (currency === 'JPY') {
    return `${symbol}${Math.round(amount).toLocaleString()}`;
  }
  
  return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function detectCurrencyFromText(text: string): { amount: number | null; currency: string; display: string } {
  const patterns = [
    { regex: /\$\s*([\d,]+(?:\.\d{2})?)/g, currency: 'USD' },
    { regex: /€\s*([\d,]+(?:\.\d{2})?)/g, currency: 'EUR' },
    { regex: /£\s*([\d,]+(?:\.\d{2})?)/g, currency: 'GBP' },
    { regex: /¥\s*([\d,]+)/g, currency: 'JPY' },
    { regex: /₹\s*([\d,]+(?:\.\d{2})?)/g, currency: 'INR' },
    { regex: /CHF\s*([\d,]+(?:\.\d{2})?)/gi, currency: 'CHF' },
    { regex: /USD\s*([\d,]+(?:\.\d{2})?)/gi, currency: 'USD' },
    { regex: /EUR\s*([\d,]+(?:\.\d{2})?)/gi, currency: 'EUR' },
    { regex: /GBP\s*([\d,]+(?:\.\d{2})?)/gi, currency: 'GBP' },
  ];

  for (const { regex, currency } of patterns) {
    const match = regex.exec(text);
    if (match) {
      const amount = parseFloat(match[1].replace(/,/g, ''));
      return { amount, currency, display: formatPrice(amount, currency) };
    }
  }

  return { amount: null, currency: 'USD', display: 'Price on request' };
}
