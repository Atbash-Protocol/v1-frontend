import Decimal from 'decimal.js';
import { BigNumber, Contract, providers } from 'ethers';

import { LpBondContract, LpReserveContract } from 'abi';

import { BondAddresses } from '../bonds.types';
import { Bond } from './bond';

export class StableBond extends Bond {
    public initializeContracts({ bondAddress, reserveAddress }: BondAddresses, signer: providers.JsonRpcSigner): void {
        this.bondContract = new Contract(bondAddress, LpBondContract, signer);
        this.reserveContract = new Contract(reserveAddress, LpReserveContract, signer);
    }

    public async getTreasuryBalance(bondCalculatorContract: Contract, treasuryAddress: string) {
        const reserveContract = this.getReserveContract();

        const tokenAmount: BigNumber = await reserveContract.balanceOf(treasuryAddress);

        return new Decimal(tokenAmount.toHexString()).div(10 ** 18).toNumber();
    }

    public getTokenAmount() {
        return Promise.resolve(0);
    }

    public getSbAmount() {
        return Promise.resolve(0);
    }
}
