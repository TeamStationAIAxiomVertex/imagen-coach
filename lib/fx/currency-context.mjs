import {
  currencyForCountry,
  DEFAULT_COUNTRY,
  DEFAULT_CURRENCY,
  normalizeCountry,
  normalizeCurrency,
  profileForCurrency,
} from "./currency-map.mjs";

export function countryFromRequest(request) {
  return normalizeCountry(request?.cf?.country || request?.headers?.get("CF-IPCountry") || DEFAULT_COUNTRY);
}

export function currencyContextFromRequest(request, overrideCurrency) {
  const country = countryFromRequest(request);
  const detectedCurrency = currencyForCountry(country);
  const currency = overrideCurrency ? normalizeCurrency(overrideCurrency) : detectedCurrency || DEFAULT_CURRENCY;
  const profile = profileForCurrency(currency);
  return {
    country,
    detectedCurrency,
    currency,
    locale: profile.locale,
    profile,
    source: overrideCurrency ? "manual" : "cloudflare-country",
  };
}
