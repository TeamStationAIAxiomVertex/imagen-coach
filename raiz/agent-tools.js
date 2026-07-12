(function () {
  const SITE_ORIGIN = "https://raiz.coachdeimagen.com";
  const WHATSAPP_URL = "https://wa.me/526646105348?text=Hola%20Sonia%2C%20me%20interesa%20La%20Ra%C3%ADz%20del%20Dinero.%20Quiero%20conocer%20la%20modalidad%20online%20o%20semipresencial%20en%20Guadalajara.";
  const modelContext = document.modelContext || navigator.modelContext;

  if (!modelContext) return;

  const fetchJson = async (pathname) => {
    const response = await fetch(new URL(pathname, SITE_ORIGIN), {
      headers: { accept: "application/json" },
      credentials: "omit",
    });
    if (!response.ok) throw new Error(`resource_unavailable:${response.status}`);
    return response.json();
  };

  const normalizeQuery = (value) => String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length > 2);

  const scoreCard = (card, terms) => {
    if (!terms.length) return 1;
    const haystack = normalizeQuery(`${card.question} ${card.answer} ${card.intent || ""}`);
    return terms.reduce((score, term) => score + (haystack.includes(term) ? 1 : 0), 0);
  };

  const tools = [
    {
      name: "la-raiz.get-program-summary",
      description: "Return the verified public definition, audience, duration, professional boundaries and source URLs for Sonia McRorey's La Raíz del Dinero program.",
      inputSchema: { type: "object", additionalProperties: false, properties: {} },
      execute: async () => {
        const program = await fetchJson("/agent/programa-la-raiz.json");
        return {
          name: program.name,
          description: program.description,
          duration: program.duration,
          audience: program.audience,
          modalities: program.modalities,
          boundaries: program.authority?.boundaries || [],
          canonical_url: SITE_ORIGIN,
          evidence_url: `${SITE_ORIGIN}/agent/evidence.json`,
        };
      },
      annotations: { readOnlyHint: true },
    },
    {
      name: "la-raiz.find-answer-cards",
      description: "Find the most relevant verified La Raíz answer cards for a Spanish-language question without inventing program claims, prices or availability.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          query: { type: "string", description: "Question or topic to match against the governed public answer-card corpus." },
          limit: { type: "integer", minimum: 1, maximum: 8, default: 5 },
        },
        required: ["query"],
      },
      execute: async ({ query, limit = 5 } = {}) => {
        const corpus = await fetchJson("/api/knowledge/questions.json");
        const terms = normalizeQuery(query);
        const cards = (corpus.cards || [])
          .map((card) => ({ card, score: scoreCard(card, terms) }))
          .filter(({ score }) => score > 0)
          .sort((a, b) => b.score - a.score || a.card.question.localeCompare(b.card.question, "es"))
          .slice(0, Math.min(Math.max(Number(limit) || 5, 1), 8))
          .map(({ card }) => ({
            id: card.id,
            question: card.question,
            answer: card.answer,
            ontology_group: card.ontologyGroup,
            evidence_sources: card.evidenceSourceIds,
            canonical_source: card.canonicalSource,
          }));
        return {
          query,
          cards,
          corpus_url: `${SITE_ORIGIN}/api/knowledge/questions.json`,
          evidence_url: `${SITE_ORIGIN}/agent/evidence.json`,
        };
      },
      annotations: { readOnlyHint: true },
    },
    {
      name: "la-raiz.compare-modalities",
      description: "Compare the verified online and semipresential La Raíz delivery formats and return their official public URLs.",
      inputSchema: { type: "object", additionalProperties: false, properties: {} },
      execute: async () => {
        const program = await fetchJson("/agent/programa-la-raiz.json");
        return {
          modalities: program.modalities,
          pricing_section: `${SITE_ORIGIN}/#inversion`,
          note: "Dates, capacity and the price currently applicable must be confirmed with Sonia through the official WhatsApp route.",
        };
      },
      annotations: { readOnlyHint: true },
    },
    {
      name: "la-raiz.get-pricing",
      description: "Return canonical MXN pricing for La Raíz and optional approximate conversion in a supported display currency. MXN remains the settlement currency.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          currency: {
            type: "string",
            enum: ["MXN", "USD", "CAD", "COP", "ARS", "CLP", "PEN", "BRL", "EUR", "GBP", "JPY", "AUD", "NZD"],
            default: "MXN",
          },
        },
      },
      execute: async ({ currency = "MXN" } = {}) => {
        const program = await fetchJson("/agent/programa-la-raiz.json");
        const current = program.pricing?.modalities || [];
        const primaryAmounts = current.map((modality) => {
          const promotion = (modality.promotions || []).find((item) => item.options?.some((option) => option.label === "Pago único"));
          const options = promotion?.options || modality.regular || [];
          const primary = options.find((option) => option.label === "Pago único");
          return { id: modality.id, name: modality.name, amount_mxn: primary?.amount || null };
        });
        const localized = await Promise.all(primaryAmounts.map(async (item) => {
          if (!item.amount_mxn) return { ...item, localized: null };
          const url = new URL("/api/fx-pricing", SITE_ORIGIN);
          url.searchParams.set("amount", String(item.amount_mxn));
          url.searchParams.set("currency", currency);
          const payload = await fetchJson(`${url.pathname}${url.search}`);
          return { ...item, canonical: payload.canonical, localized: payload.localized };
        }));
        return {
          settlement_currency: "MXN",
          display_currency: currency,
          prices: localized,
          disclaimer: "Official pricing and payment are in Mexican Pesos (MXN). Displayed conversions are estimates.",
          pricing_section: `${SITE_ORIGIN}/#inversion`,
        };
      },
      annotations: { readOnlyHint: true },
    },
    {
      name: "la-raiz.get-contact-options",
      description: "Return Sonia McRorey's public La Raíz WhatsApp handoff and supporting program links without submitting data or modifying state.",
      inputSchema: { type: "object", additionalProperties: false, properties: {} },
      execute: async () => ({
        whatsapp_url: WHATSAPP_URL,
        program_url: SITE_ORIGIN,
        modalities_url: `${SITE_ORIGIN}/#modalidades`,
        pricing_url: `${SITE_ORIGIN}/#inversion`,
        note: "This tool only returns public contact options. It does not send a message or reserve a place.",
      }),
      annotations: { readOnlyHint: true },
    },
  ];

  try {
    if (typeof modelContext.registerTool === "function") {
      const controller = new AbortController();
      tools.forEach((tool) => modelContext.registerTool(tool, { signal: controller.signal }));
      window.addEventListener("pagehide", () => controller.abort(), { once: true });
    } else if (typeof modelContext.provideContext === "function") {
      modelContext.provideContext({
        name: "la-raiz.browser-context",
        title: "La Raíz del Dinero Browser Tools",
        description: "Read-only tools for verified program information, governed answer cards, modalities, canonical MXN pricing and Sonia McRorey's public contact route.",
        tools,
      });
    }
    window.__laRaizWebMcpTools = tools.map((tool) => tool.name);
  } catch (_) {
    // Browsers without complete WebMCP support continue with the static site.
  }
}());
