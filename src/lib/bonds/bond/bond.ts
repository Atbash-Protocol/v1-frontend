import { ethers } from 'ethers';
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

    // Async method that returns a Promise
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
        }
    }

    public getBondContract(): ethers.Contract {
        if (this.bondContract === undefined) throw new Error(`Bond contract for bond "${this.bondOptions.name} is undefined`);

        return this.bondContract;
    }

    public getReserveContract(): ethers.Contract {
        if (this.reserveContract === undefined) throw new Error(`Bond contract for bond "${this.bondOptions.name} is undefined`);

        return this.reserveContract;
    }

    public getBondAddresses(): BondAddresses {
        return {
            bondAddress: '0xcE24D6A45D5c59D31D05c8C278cA3455dD6a43DA',
            reserveAddress: '0x26DF06b47412dA76061ddA1fD9fe688A497FB88b',
        };
    }

    public isCustomBond(): boolean {
        return this.bondOptions.type === BondType.CUSTOM;
    }
}

// export interface BondOpts {
//     readonly name: string; // Internal name used for references
//     readonly displayName: string; // Displayname on UI
//     readonly bondIconSvg: string; //  SVG path for icons
//     readonly bondContractABI: ContractInterface; // ABI for contract
//     readonly networkAddrs: NetworkAddresses; // Mapping of network --> Addresses
//     readonly bondToken: ActiveTokensEnum; // Unused, but native token to buy the bond.
//     readonly isActive: boolean; // Set to false to disable mint
//     readonly networkID: number; // Set to false to disable mint
// }

// export abstract class Bond {
//     public readonly name: string;
//     public readonly displayName: string;
//     public readonly type: BondType;
//     public readonly bondIconSvg: string;
//     public readonly bondContractABI: ContractInterface; // Bond ABI
//     public readonly networkAddrs: NetworkAddresses;
//     public readonly bondToken: ActiveTokensEnum;
//     public readonly lpUrl?: string;
//     public readonly isActive?: boolean;
//     public readonly networkID: Networks;

//     // The following two fields will differ on how they are set depending on bond type
//     public abstract isLP: boolean;
//     protected abstract reserveContractAbi: ContractInterface; // Token ABI
//     public abstract displayUnits: string;

//     // Async method that returns a Promise
//     public abstract getTreasuryBalance(networkID: Networks, provider: StaticJsonRpcProvider): Promise<number>;
//     public abstract getTokenAmount(networkID: Networks, provider: StaticJsonRpcProvider): Promise<number>;
//     public abstract getSbAmount(networkID: Networks, provider: StaticJsonRpcProvider): Promise<number>;

//     constructor(type: BondType, bondOpts: BondOpts) {
//         this.name = bondOpts.name;

//         this.displayName = bondOpts.displayName;
//         this.type = type;
//         this.bondIconSvg = bondOpts.bondIconSvg;
//         this.bondContractABI = bondOpts.bondContractABI;
//         this.networkAddrs = bondOpts.networkAddrs;
//         this.bondToken = bondOpts.bondToken;
//         this.isActive = bondOpts.isActive;
//         this.networkID = bondOpts.networkID;
//     }

//     public getAddressForBond() {
//         return this.networkAddrs[this.networkID].bondAddress;
//     }

//     public getContractForBond(provider: StaticJsonRpcProvider | JsonRpcSigner) {
//         const bondAddress = this.getAddressForBond();
//         return new Contract(bondAddress, this.bondContractABI, provider);
//     }

//     public getAddressForReserve() {
//         return this.networkAddrs[this.networkID]!.reserveAddress;
//     }

//     public getContractForReserve(provider: StaticJsonRpcProvider | JsonRpcSigner) {
//         const reserveAddress = this.getAddressForReserve();
//         return new Contract(reserveAddress, this.reserveContractAbi, provider);
//     }

//     protected getTokenPrice(markets: MarketSlice["markets"]): number {
//         const price = markets[this.bondToken];

//         if (!price) throw new Error("Unable to get prices for bond");

//         return price;
//     }
// }
