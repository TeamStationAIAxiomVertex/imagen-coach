import { DEFAULT_CURRENCY, normalizeCurrency, SETTLEMENT_CURRENCY } from "./currency-map.mjs";

const FRANKFURTER_BASE = "https://api.frankfurter.dev/v2/rate/";
const CACHE_SECONDS = 86400;
const STALE_SECONDS = 86400;

function cacheHeaders() {
  return {
    "cache-control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${STALE_SECONDS}`,
  };
}

function rateUrl(toCurrency) {
  return new URL(`${SETTLEMENT_CURRENCY}/${toCurrency}`, FRANKFURTER_BASE);
}

async function fetchProviderRate(toCurrency) {
  const url = rateUrl(toCurrency);
  const response = await fetch(url.toString(), {
    headers: { accept: "application/json" },
    cf: {
      cacheTtl: CACHE_SECONDS,
      cacheEverything: true,
    },
  });

  if (!response.ok) {
    throw new Error(`FX provider returned ${response.status}`);
  }

  const payload = await response.json();
  const rate = Number(payload?.rate);
  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error(`FX provider missing ${toCurrency} rate`);
  }

  return {
    from: SETTLEMENT_CURRENCY,
    to: toCurrency,
    rate,
    asOf: payload.date || new Date().toISOString().slice(0, 10),
    provider: "Frankfurter v2",
    stale: false,
  };
}

export async function getExchangeRate(toCurrency) {
  const currency = normalizeCurrency(toCurrency || DEFAULT_CURRENCY);
  if (currency === SETTLEMENT_CURRENCY) {
    return {
      from: SETTLEMENT_CURRENCY,
      to: SETTLEMENT_CURRENCY,
      rate: 1,
      asOf: new Date().toISOString().slice(0, 10),
      provider: "canonical",
      stale: false,
    };
  }

  return fetchProviderRate(currency);
}

export function exchangeRateCacheHeaders() {
  return cacheHeaders();
}
