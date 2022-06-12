import { ethers, providers } from 'ethers';
import { snakeCase } from 'lodash';

import { BondAddresses, BondProviderEnum, BondType } from '../bonds.types';

export interface BondOptions {
    name: string;
    displayName: string;
    token: string;
    iconPath: string;
    lpProvider: BondProviderEnum; // sushi rinkeby: "https://app.sushi.com/add/0x6C538aDf35d1927497090e6971Fc46D8ed813dF6/0xdc7B08BB2AbcE1BA5b82509115F3fb7358E412aB",
    type: BondType;
    networkID: number;
    isActive: boolean;
}

export abstract class Bond {
    public ID: string;

    protected bondContract?: ethers.Contract;

    protected reserveContract?: ethers.Contract;

    constructor(public readonly bondOptions: BondOptions) {
        this.ID = snakeCase(bondOptions.name);
    }

    public abstract initializeContracts({ bondAddress, reserveAddress }: BondAddresses, signer: providers.JsonRpcSigner): void;
    public abstract getTreasuryBalance(bondCalculatorContract: ethers.Contract, treasuryAddress: string): Promise<number>;
    public abstract getTokenAmount(): Promise<number>;
    public abstract getSbAmount(BASH_ADDRESS: string): Promise<number>;

    public isLP(): boolean {
        return this.bondOptions.type === BondType.LP;
    }

    public getLPProvider(): string {
        const { bondAddress, reserveAddress } = this.getBondAddresses();

        switch (this.bondOptions.lpProvider) {
            case BondProviderEnum.UNISWAP_V2: {
                return [BondProviderEnum.UNISWAP_V2, bondAddress, reserveAddress].join('/');
            }
            default:
                throw new Error(`This LP Provider is not handled : "${this.bondOptions.lpProvider}"`);
        }
    }

    public getBondContract(): ethers.Contract {
        if (this.bondContract === undefined) throw new Error(`Bond contract for bond "${this.bondOptions.name}" is undefined`);

        return this.bondContract;
    }

    public getReserveContract(): ethers.Contract {
        if (this.reserveContract === undefined) throw new Error(`Reserve contract for bond "${this.bondOptions.name}" is undefined`);

        return this.reserveContract;
    }

    public getBondAddresses(): BondAddresses {
        if (!this.reserveContract || !this.bondContract) throw new Error('Unable to get the bonds contracts');

        return {
            bondAddress: this.bondContract.address,
            reserveAddress: this.reserveContract.address,
        };
    }

    public isCustomBond(): boolean {
        return this.bondOptions.type === BondType.CUSTOM;
    }
}
