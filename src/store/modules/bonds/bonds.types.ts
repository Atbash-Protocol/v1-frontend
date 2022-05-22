import { Contract, ethers } from 'ethers';

import { LPBond } from 'lib/bonds/bond/lp-bond';
import { StableBond } from 'lib/bonds/bond/stable-bond';

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
    terms?: string;
}

export interface BondTerms {
    vestingTerm: string;
}

export interface BondItem {
    bondInstance: LPBond | StableBond;
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
    bondInstances: Record<string, LPBond | StableBond>;
    bondMetrics: Record<string, BondMetrics>;
    bondCalculator: Contract | null;
    treasuryBalance: number | null;
    loading: boolean;
    bondQuoting: boolean;
    bondQuote: BondQuote;
}
