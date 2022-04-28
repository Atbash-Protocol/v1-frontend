import { Contract, providers } from 'ethers';

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
        if (!this.reserveContract) throw new Error('Reserve contract is undefined');

        const tokenAmount = await this.reserveContract.balanceOf(treasuryAddress);

        const valuation = await bondCalculatorContract.valuation(this.reserveContract.address, tokenAmount);
        const markdown = await bondCalculatorContract.markdown(this.reserveContract.address);
        const tokenUSD = (valuation / Math.pow(10, 9)) * (markdown / Math.pow(10, 18));

        return tokenUSD;
    }

    public getTokenAmount() {
        return this.getReserves('', true);
    }

    public getSbAmount(BASH_ADDRESS: string) {
        return this.getReserves(BASH_ADDRESS, false);
    }

    private async getReserves(BASH_ADDRESS: string, isToken: boolean): Promise<number> {
        const token = this.reserveContract;

        if (!token) throw new Error('Reserve contract is not defined');

        const [reserve0, reserve1] = await token.getReserves();
        const token1: string = await token.token1();
        const isBASH = token1.toLowerCase() === BASH_ADDRESS.toLowerCase();

        return isToken ? this.toTokenDecimal(false, isBASH ? reserve0 : reserve1) : this.toTokenDecimal(true, isBASH ? reserve1 : reserve0);
    }

    private toTokenDecimal(isBASH: boolean, reserve: number) {
        return isBASH ? reserve / Math.pow(10, 9) : reserve / Math.pow(10, 18);
    }
}
