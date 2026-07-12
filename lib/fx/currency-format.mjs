import { DEFAULT_CURRENCY, profileForCurrency, SETTLEMENT_CURRENCY } from "./currency-map.mjs";

export function formatCurrency(amount, currency = DEFAULT_CURRENCY, locale) {
  const profile = profileForCurrency(currency);
  return new Intl.NumberFormat(locale || profile.locale, {
    style: "currency",
    currency,
    minimumFractionDigits: profile.fractionDigits,
    maximumFractionDigits: profile.fractionDigits,
    currencyDisplay: "narrowSymbol",
  }).format(amount);
}

export function formatMxn(amount) {
  return `${formatCurrency(amount, SETTLEMENT_CURRENCY, "es-MX")} MXN`;
}

export function formatApproximation(amount, currency, locale) {
  return `≈ ${formatCurrency(amount, currency, locale)} ${currency}`;
}

export function spokenAmount(amount, currency, locale) {
  const profile = profileForCurrency(currency);
  const number = new Intl.NumberFormat(locale || profile.locale, {
    maximumFractionDigits: profile.fractionDigits,
  }).format(amount);
  return `${number} ${profile.nameEn}`;
}
