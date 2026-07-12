import { SETTLEMENT_CURRENCY } from "./currency-map.mjs";

export const PRICE_SOURCE = {
  settlementCurrency: SETTLEMENT_CURRENCY,
  sourceOfTruth: "raiz/program.json",
  checkoutMode: "single_settlement_currency",
};

export function canonicalPrice(amountMxn, context = {}) {
  return {
    amount: Number(amountMxn),
    settlementCurrency: SETTLEMENT_CURRENCY,
    displayCurrency: context.displayCurrency || SETTLEMENT_CURRENCY,
    label: context.label || "Pago",
    modality: context.modality || "La Raíz del Dinero",
  };
}
