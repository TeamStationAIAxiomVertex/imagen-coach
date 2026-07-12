(function () {
  const STORAGE_KEY = "raiz.currency";
  const SUPPORTED = ["MXN", "USD", "CAD", "COP", "ARS", "CLP", "PEN", "BRL", "EUR", "GBP", "JPY", "AUD", "NZD"];
  const PROFILES = {
    MXN: { flag: "🇲🇽", label: "MXN" },
    USD: { flag: "🇺🇸", label: "USD" },
    CAD: { flag: "🇨🇦", label: "CAD" },
    COP: { flag: "🇨🇴", label: "COP" },
    ARS: { flag: "🇦🇷", label: "ARS" },
    CLP: { flag: "🇨🇱", label: "CLP" },
    PEN: { flag: "🇵🇪", label: "PEN" },
    BRL: { flag: "🇧🇷", label: "BRL" },
    EUR: { flag: "🇪🇸", label: "EUR" },
    GBP: { flag: "🇬🇧", label: "GBP" },
    JPY: { flag: "🇯🇵", label: "JPY" },
    AUD: { flag: "🇦🇺", label: "AUD" },
    NZD: { flag: "🇳🇿", label: "NZD" },
  };

  function storedCurrency() {
    try {
      const value = window.localStorage.getItem(STORAGE_KEY);
      return SUPPORTED.includes(value) ? value : "";
    } catch (_) {
      return "";
    }
  }

  function saveCurrency(currency) {
    try {
      window.localStorage.setItem(STORAGE_KEY, currency);
    } catch (_) {
      // Storage can be unavailable in hardened browsers. The selector still works for the current page view.
    }
  }

  function currencyOption(currency) {
    const profile = PROFILES[currency] || { flag: "", label: currency };
    return `${profile.flag} ${profile.label}`.trim();
  }

  async function loadFx(amount, currency) {
    const url = new URL("/api/fx-pricing", window.location.origin);
    url.searchParams.set("amount", String(amount));
    if (currency) url.searchParams.set("currency", currency);
    const response = await fetch(url.toString(), {
      headers: { accept: "application/json" },
      credentials: "same-origin",
    });
    if (!response.ok) throw new Error("fx_request_failed");
    return response.json();
  }

  function setEstimate(node, payload) {
    if (!payload || !payload.localized || payload.displayCurrency === "MXN") {
      node.textContent = "";
      node.setAttribute("aria-hidden", "true");
      node.classList.remove("is-visible");
      return;
    }
    node.textContent = payload.localized.formatted;
    node.setAttribute("aria-label", payload.localized.spoken);
    node.removeAttribute("aria-hidden");
    node.classList.add("is-visible");
  }

  function setBadge(payload) {
    const badge = document.querySelector("[data-fx-rate-badge]");
    if (!badge) return;
    if (!payload || !payload.localized) {
      badge.textContent = "";
      badge.setAttribute("hidden", "");
      return;
    }
    badge.textContent = `Tipo de cambio ${payload.localized.provider} · ${payload.localized.asOf}`;
    badge.removeAttribute("hidden");
  }

  function setSelector(currency) {
    const selector = document.querySelector("[data-currency-selector]");
    if (!selector || !currency) return;
    selector.value = currency;
  }

  async function refresh(currency) {
    const nodes = Array.from(document.querySelectorAll("[data-fx-price]"));
    if (!nodes.length) return;
    const requests = nodes.map(async (node) => {
      const amount = Number(node.getAttribute("data-mxn-amount"));
      if (!Number.isFinite(amount) || amount <= 0) return null;
      const payload = await loadFx(amount, currency);
      setEstimate(node, payload);
      return payload;
    });
    try {
      const payloads = (await Promise.all(requests)).filter(Boolean);
      const first = payloads[0];
      if (first) {
        setSelector(first.displayCurrency);
        setBadge(first);
      }
    } catch (_) {
      nodes.forEach((node) => setEstimate(node, null));
      setBadge(null);
    }
  }

  function init() {
    const selector = document.querySelector("[data-currency-selector]");
    if (selector) {
      selector.innerHTML = SUPPORTED.map((currency) => `<option value="${currency}">${currencyOption(currency)}</option>`).join("");
      selector.addEventListener("change", (event) => {
        const currency = event.target.value;
        saveCurrency(currency);
        refresh(currency);
      });
    }
    refresh(storedCurrency());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
}());
