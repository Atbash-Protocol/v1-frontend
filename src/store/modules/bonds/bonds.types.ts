import Decimal from 'decimal.js';
import { Contract, ethers } from 'ethers';

import { LPBond } from 'lib/bonds/bond/lp-bond';
import { StableBond } from 'lib/bonds/bond/stable-bond';

export type Bond = LPBond | StableBond;
export interface BondMetrics {
    treasuryBalance: number | null;
    bondDiscount: Decimal | null;
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
    terms?: string;
}

export interface BondCoreMetrics {
    rfv: number;
    rfvTreasury: number;
    runway: number;
    deltaMarketPriceRfv: number;
}
export interface BondTerms {
    vestingTerm: string;
}

export interface BondItem {
    bondInstance: Bond;
    metrics: BondMetrics;
    // terms: BondTerms;
}

export interface BondQuote {
    interestDue: number | null;
    bondMaturationBlock: number | null;
    pendingPayout: number | null;
}

export interface BondSlice {
    bonds: Record<string, BondItem>;
    bondInstances: Record<string, Bond>;
    bondMetrics: Record<string, BondMetrics>;
    bondCalculator: Contract | null;
    treasuryBalance: number | null;
    coreMetrics: BondCoreMetrics;

    loading: boolean;
    bondQuoting: boolean;
    bondQuote: BondQuote;
}
