export const DEFAULT_COUNTRY = "MX";
export const DEFAULT_CURRENCY = "MXN";
export const SETTLEMENT_CURRENCY = "MXN";

export const SUPPORTED_CURRENCIES = [
  "MXN",
  "USD",
  "CAD",
  "COP",
  "ARS",
  "CLP",
  "PEN",
  "BRL",
  "EUR",
  "GBP",
  "JPY",
  "AUD",
  "NZD",
];

export const CURRENCY_PROFILES = {
  MXN: { flag: "🇲🇽", locale: "es-MX", nameEn: "Mexican Pesos", nameEs: "pesos mexicanos", fractionDigits: 0 },
  USD: { flag: "🇺🇸", locale: "en-US", nameEn: "US Dollars", nameEs: "dólares estadounidenses", fractionDigits: 0 },
  CAD: { flag: "🇨🇦", locale: "en-CA", nameEn: "Canadian Dollars", nameEs: "dólares canadienses", fractionDigits: 0 },
  COP: { flag: "🇨🇴", locale: "es-CO", nameEn: "Colombian Pesos", nameEs: "pesos colombianos", fractionDigits: 0 },
  ARS: { flag: "🇦🇷", locale: "es-AR", nameEn: "Argentine Pesos", nameEs: "pesos argentinos", fractionDigits: 0 },
  CLP: { flag: "🇨🇱", locale: "es-CL", nameEn: "Chilean Pesos", nameEs: "pesos chilenos", fractionDigits: 0 },
  PEN: { flag: "🇵🇪", locale: "es-PE", nameEn: "Peruvian Soles", nameEs: "soles peruanos", fractionDigits: 0 },
  BRL: { flag: "🇧🇷", locale: "pt-BR", nameEn: "Brazilian Reais", nameEs: "reales brasileños", fractionDigits: 0 },
  EUR: { flag: "🇪🇸", locale: "es-ES", nameEn: "Euros", nameEs: "euros", fractionDigits: 0 },
  GBP: { flag: "🇬🇧", locale: "en-GB", nameEn: "British Pounds", nameEs: "libras esterlinas", fractionDigits: 0 },
  JPY: { flag: "🇯🇵", locale: "ja-JP", nameEn: "Japanese Yen", nameEs: "yenes japoneses", fractionDigits: 0 },
  AUD: { flag: "🇦🇺", locale: "en-AU", nameEn: "Australian Dollars", nameEs: "dólares australianos", fractionDigits: 0 },
  NZD: { flag: "🇳🇿", locale: "en-NZ", nameEn: "New Zealand Dollars", nameEs: "dólares neozelandeses", fractionDigits: 0 },
};

export const COUNTRY_CURRENCY_MAP = {
  MX: "MXN",
  US: "USD",
  CA: "CAD",
  CO: "COP",
  AR: "ARS",
  CL: "CLP",
  PE: "PEN",
  BR: "BRL",
  ES: "EUR",
  FR: "EUR",
  DE: "EUR",
  IT: "EUR",
  PT: "EUR",
  NL: "EUR",
  IE: "EUR",
  BE: "EUR",
  AT: "EUR",
  GB: "GBP",
  JP: "JPY",
  AU: "AUD",
  NZ: "NZD",
};

export function normalizeCountry(country) {
  const clean = String(country || "").trim().toUpperCase();
  return /^[A-Z]{2}$/.test(clean) ? clean : DEFAULT_COUNTRY;
}

export function normalizeCurrency(currency) {
  const clean = String(currency || "").trim().toUpperCase();
  return SUPPORTED_CURRENCIES.includes(clean) ? clean : DEFAULT_CURRENCY;
}

export function currencyForCountry(country) {
  return COUNTRY_CURRENCY_MAP[normalizeCountry(country)] || DEFAULT_CURRENCY;
}

export function profileForCurrency(currency) {
  return CURRENCY_PROFILES[normalizeCurrency(currency)] || CURRENCY_PROFILES[DEFAULT_CURRENCY];
}
