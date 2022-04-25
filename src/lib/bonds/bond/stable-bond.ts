import { JsonRpcSigner } from '@ethersproject/providers';
import { Contract } from 'ethers';

import { LpBondContract, LpReserveContract } from 'abi';

import { BondAddresses } from '../bonds.types';
import { Bond } from './bond';

export class StableBond extends Bond {
    public initializeContracts({ bondAddress, reserveAddress }: BondAddresses, signer: JsonRpcSigner): void {
        this.bondContract = new Contract(bondAddress, LpBondContract, signer);
        this.reserveContract = new Contract(reserveAddress, LpReserveContract, signer);
    }

    public async getTreasuryBalance(bondCalculatorContract: Contract, treasuryAddress: string) {
        if (!this.reserveContract) throw new Error('Unable to get reserveContract');

        const tokenAmount = await this.reserveContract.balanceOf(treasuryAddress);

        return tokenAmount / Math.pow(10, 18);
    }

    public getTokenAmount() {
        console.warn('Not implemented');
        return Promise.resolve(0);
    }

    public getSbAmount(BASH_ADDRESS: string) {
        return Promise.resolve(0);
    }
}
