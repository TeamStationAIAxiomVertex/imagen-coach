import { currencyContextFromRequest } from "../../lib/fx/currency-context.mjs";
import { formatApproximation, formatMxn, spokenAmount } from "../../lib/fx/currency-format.mjs";
import { getExchangeRate, exchangeRateCacheHeaders } from "../../lib/fx/exchange-rate-service.mjs";
import { normalizeCurrency, profileForCurrency, SETTLEMENT_CURRENCY } from "../../lib/fx/currency-map.mjs";

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "x-content-type-options": "nosniff",
};

function responseJson(payload, init = {}) {
  return new Response(JSON.stringify(payload), {
    ...init,
    headers: {
      ...jsonHeaders,
      ...exchangeRateCacheHeaders(),
      ...(init.headers || {}),
    },
  });
}

function requestedAmount(url) {
  const amount = Number(url.searchParams.get("amount") || 0);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  const amountMxn = requestedAmount(url);
  const overrideCurrency = url.searchParams.get("currency");
  const currencyContext = currencyContextFromRequest(request, overrideCurrency);
  const displayCurrency = normalizeCurrency(currencyContext.currency);
  const profile = profileForCurrency(displayCurrency);

  if (!amountMxn) {
    return responseJson({ error: "amount_required" }, { status: 400 });
  }

  const canonical = {
    amount: amountMxn,
    currency: SETTLEMENT_CURRENCY,
    formatted: formatMxn(amountMxn),
    spoken: spokenAmount(amountMxn, SETTLEMENT_CURRENCY, "es-MX"),
  };

  if (displayCurrency === SETTLEMENT_CURRENCY) {
    return responseJson({
      canonical,
      country: currencyContext.country,
      displayCurrency,
      detectedCurrency: currencyContext.detectedCurrency,
      locale: profile.locale,
      source: currencyContext.source,
      localized: null,
      disclaimer: {
        es: "El precio oficial y el cobro se realizan en pesos mexicanos (MXN).",
        en: "Official pricing and payment are in Mexican Pesos (MXN).",
      },
    });
  }

  try {
    const rate = await getExchangeRate(displayCurrency);
    const localizedAmount = amountMxn * rate.rate;
    return responseJson({
      canonical,
      country: currencyContext.country,
      displayCurrency,
      detectedCurrency: currencyContext.detectedCurrency,
      locale: profile.locale,
      source: currencyContext.source,
      localized: {
        amount: localizedAmount,
        currency: displayCurrency,
        formatted: formatApproximation(localizedAmount, displayCurrency, profile.locale),
        spoken: `Approximately ${spokenAmount(localizedAmount, displayCurrency, profile.locale)}`,
        rate: rate.rate,
        provider: rate.provider,
        asOf: rate.asOf,
        stale: rate.stale,
      },
      disclaimer: {
        es: "El precio oficial y el cobro se realizan en pesos mexicanos (MXN). La conversión mostrada es aproximada y puede variar según el tipo de cambio de tu banco o proveedor de pago.",
        en: "Official pricing and payment are in Mexican Pesos (MXN). The displayed conversion is an estimate based on today's exchange rate. Your bank or payment provider may use a different rate.",
      },
    });
  } catch (error) {
    return responseJson({
      canonical,
      country: currencyContext.country,
      displayCurrency,
      detectedCurrency: currencyContext.detectedCurrency,
      locale: profile.locale,
      source: currencyContext.source,
      localized: null,
      error: "fx_unavailable",
      disclaimer: {
        es: "El precio oficial y el cobro se realizan en pesos mexicanos (MXN).",
        en: "Official pricing and payment are in Mexican Pesos (MXN).",
      },
    }, { status: 200 });
  }
}
