import { ethers } from "ethers";
import { LPBond } from "lib/bonds/bond/lp-bond";

export interface BondMetrics {
    treasuryBalance: number | null;
    bondDiscount: number | null;
    bondQuote: number | null;
    purchased: number | null;
    vestingTerm: number | null;
    maxBondPrice: number | null;
    bondPrice: ethers.BigNumber | null;
    marketPrice: number | null;
    maxBondPriceToken: number | null;
    allowance: number | null;
    balance: number | null;
    loading?: boolean;
}

export interface BondTerms {
    vestingTerm: string;
}

export interface BondItem {
    bondInstance: LPBond;
    metrics: BondMetrics;
    terms: BondTerms;
}

export interface BondSlice {
    bonds: Record<string, BondItem>;
    bondCalculator: ethers.Contract | null;
    treasuryBalance: number | null;
    loading: boolean;
    bondQuoting: boolean;
}
