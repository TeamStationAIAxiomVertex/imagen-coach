import assert from "node:assert/strict";

import { onRequestGet } from "../functions/api/fx-pricing.js";
import { currencyContextFromRequest } from "../lib/fx/currency-context.mjs";
import { formatApproximation, formatMxn } from "../lib/fx/currency-format.mjs";
import { currencyForCountry } from "../lib/fx/currency-map.mjs";

function requestWithCountry(url, country) {
  const request = new Request(url);
  Object.defineProperty(request, "cf", {
    configurable: true,
    value: { country },
  });
  return request;
}

assert.equal(currencyForCountry("MX"), "MXN");
assert.equal(currencyForCountry("US"), "USD");
assert.equal(currencyForCountry("CO"), "COP");
assert.equal(currencyForCountry("ES"), "EUR");
assert.equal(currencyForCountry("BR"), "BRL");

const detected = currencyContextFromRequest(requestWithCountry("https://raiz.coachdeimagen.com/", "CO"));
assert.equal(detected.country, "CO");
assert.equal(detected.currency, "COP");
assert.equal(detected.source, "cloudflare-country");

const overridden = currencyContextFromRequest(
  requestWithCountry("https://raiz.coachdeimagen.com/", "MX"),
  "USD",
);
assert.equal(overridden.currency, "USD");
assert.equal(overridden.source, "manual");

assert.equal(formatMxn(1960), "$1,960 MXN");
assert.match(formatApproximation(111.818, "USD", "en-US"), /^≈ \$112 USD$/);

const originalFetch = globalThis.fetch;
let providerRequests = 0;

try {
  globalThis.fetch = async (input) => {
    providerRequests += 1;
    const url = new URL(String(input));
    const currency = url.pathname.split("/").filter(Boolean).at(-1);
    const rates = { USD: 0.05705, COP: 239.4, EUR: 0.049 };
    return Response.json({
      date: "2026-07-11",
      base: "MXN",
      quote: currency,
      rate: rates[currency],
    });
  };

  const usdResponse = await onRequestGet({
    request: requestWithCountry(
      "https://raiz.coachdeimagen.com/api/fx-pricing?amount=1960&currency=USD",
      "MX",
    ),
  });
  const usd = await usdResponse.json();
  assert.equal(usdResponse.status, 200);
  assert.equal(usdResponse.headers.get("content-type"), "application/json; charset=utf-8");
  assert.equal(usdResponse.headers.get("cache-control"), "public, s-maxage=86400, stale-while-revalidate=86400");
  assert.equal(usd.canonical.formatted, "$1,960 MXN");
  assert.equal(usd.displayCurrency, "USD");
  assert.equal(usd.localized.formatted, "≈ $112 USD");
  assert.equal(usd.localized.provider, "Frankfurter v2");

  const copResponse = await onRequestGet({
    request: requestWithCountry(
      "https://raiz.coachdeimagen.com/api/fx-pricing?amount=1960",
      "CO",
    ),
  });
  const cop = await copResponse.json();
  assert.equal(cop.country, "CO");
  assert.equal(cop.displayCurrency, "COP");
  assert.equal(cop.localized.currency, "COP");
  assert.match(cop.localized.formatted, /^≈ .+ COP$/);

  const mxnResponse = await onRequestGet({
    request: requestWithCountry(
      "https://raiz.coachdeimagen.com/api/fx-pricing?amount=1960",
      "MX",
    ),
  });
  const mxn = await mxnResponse.json();
  assert.equal(mxn.displayCurrency, "MXN");
  assert.equal(mxn.localized, null);
  assert.equal(providerRequests, 2, "MXN canonical pricing must not call the FX provider");

  const invalidResponse = await onRequestGet({
    request: requestWithCountry("https://raiz.coachdeimagen.com/api/fx-pricing", "US"),
  });
  assert.equal(invalidResponse.status, 400);

  globalThis.fetch = async () => {
    throw new Error("provider unavailable");
  };

  const fallbackResponse = await onRequestGet({
    request: requestWithCountry(
      "https://raiz.coachdeimagen.com/api/fx-pricing?amount=1960&currency=EUR",
      "ES",
    ),
  });
  const fallback = await fallbackResponse.json();
  assert.equal(fallbackResponse.status, 200);
  assert.equal(fallback.canonical.formatted, "$1,960 MXN");
  assert.equal(fallback.localized, null);
  assert.equal(fallback.error, "fx_unavailable");
} finally {
  globalThis.fetch = originalFetch;
}

console.log("La Raíz FX pricing tests passed.");
