import { Decimal } from 'decimal.js';
import { BigNumber, Contract, providers } from 'ethers';

import { LpBondContract, LpReserveContract } from 'abi';
import { BondAddresses } from 'helpers/bond/constants';

import { Bond, BondOptions } from './bond';

// Keep all LP specific fields/logic within the LPBond class
export type LPBondOpts = BondOptions;

export class LPBond extends Bond {
    public readonly LP_URL = '';

    constructor(public readonly bondOptions: BondOptions) {
        super(bondOptions);
    }

    public initializeContracts({ bondAddress, reserveAddress }: BondAddresses, signer: providers.JsonRpcSigner): void {
        this.bondContract = new Contract(bondAddress, LpBondContract, signer);
        this.reserveContract = new Contract(reserveAddress, LpReserveContract, signer);
    }

    public async getTreasuryBalance(bondCalculatorContract: Contract, treasuryAddress: string) {
        const reserveContract = this.getReserveContract();

        const tokenAmount: BigNumber = await reserveContract.balanceOf(treasuryAddress);

        const valuation: BigNumber = await bondCalculatorContract.valuation(reserveContract.address, tokenAmount);

        const markdown: BigNumber = await bondCalculatorContract.markdown(reserveContract.address);

        // valuation * 10 ** 9 / markdown * 10 ** 18
        const tokenUSD = new Decimal(valuation.toHexString()).div(10 ** 9).mul(new Decimal(markdown.toHexString()).div(10 ** 18));

        return tokenUSD.toNumber();
    }

    public async getTokenAmount() {
        return this.getReserves('', true);
    }

    public async getSbAmount(BASH_ADDRESS: string) {
        return this.getReserves(BASH_ADDRESS, false);
    }

    private async getReserves(BASH_ADDRESS: string, isToken: boolean): Promise<number> {
        const token = this.getReserveContract();

        const [reserve0, reserve1] = await token.getReserves();
        const token1: string = await token.token1();
        const isBASH = token1.toLowerCase() === BASH_ADDRESS.toLowerCase();

        return isToken ? this.toTokenDecimal(false, isBASH ? reserve0 : reserve1) : this.toTokenDecimal(true, isBASH ? reserve1 : reserve0);
    }

    private toTokenDecimal(isBASH: boolean, reserve: number) {
        return isBASH ? reserve / Math.pow(10, 9) : reserve / Math.pow(10, 18);
    }
}
