import { StaticJsonRpcProvider } from '@ethersproject/providers';

import { Networks } from 'constants/blockchain';

import { LPBond, LPBondOpts } from './lp-bond';

// These are special bonds that have different valuation methods
export type CustomLPBondOpts = LPBondOpts;

export class CustomLPBond extends LPBond {
    // constructor(customBondOpts: CustomLPBondOpts) {
    //     super(customBondOpts);
    // }
    // override async getTreasuryBalance(networkID: Networks, provider: StaticJsonRpcProvider) {
    //     const tokenAmount = await super.getTreasuryBalance(networkID, provider);
    //     const tokenPrice = 10;
    //     // const tokenPrice = this.getTokenPrice("dai");
    //     return tokenAmount * tokenPrice;
    // }
    // override async getTokenAmount(networkID: Networks, provider: StaticJsonRpcProvider) {
    //     const tokenAmount = await super.getTokenAmount(networkID, provider);
    //     const tokenPrice = 10;
    //     // const tokenPrice = this.getTokenPrice();
    //     return tokenAmount * tokenPrice;
    // }
}
