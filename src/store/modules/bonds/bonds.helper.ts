import { BondMetrics } from "./bonds.types";

export const initDefaultBondMetrics = (): BondMetrics => ({
    treasuryBalance: null,
    bondDiscount: null,
    bondQuote: null,
    purchased: null,
    vestingTerm: null,
    maxBondPrice: null,
    bondPrice: null,
    marketPrice: null,
    maxBondPriceToken: null,
});
