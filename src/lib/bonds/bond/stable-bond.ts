// import { ContractInterface } from "ethers";
// import { Bond, BondOpts } from "./bond";
// import { BondType } from "./constants";
// import { Networks } from "../../constants/blockchain";
// import { StaticJsonRpcProvider } from "@ethersproject/providers";
// import { getAddresses } from "../../constants/addresses";

import { JsonRpcSigner } from "@ethersproject/providers";
import { LpBondContract, LpReserveContract } from "abi";
import { Contract, ContractInterface } from "ethers";
import { isJSDocThisTag } from "typescript";
import { BondAddresses, BondType } from "../bonds.types";
import { Bond, BondOptions } from "./bond";

// export interface StableBondOpts extends BondOpts {
//     readonly reserveContractAbi: ContractInterface;
// }

// export class StableBond extends Bond {
//     readonly isLP = false;
//     readonly reserveContractAbi: ContractInterface;
//     readonly displayUnits: string;

//     constructor(stableBondOpts: StableBondOpts) {
//         super(BondType.StableAsset, stableBondOpts);

//         // For stable bonds the display units are the same as the actual token
//         this.displayUnits = stableBondOpts.displayName;
//         this.reserveContractAbi = stableBondOpts.reserveContractAbi;
//     }

//     public async getTreasuryBalance(networkID: Networks, provider: StaticJsonRpcProvider) {
//         const addresses = getAddresses(networkID);
//         const token = this.getContractForReserve(networkID, provider);
//         const tokenAmount = await token.balanceOf(addresses.TREASURY_ADDRESS);
//         return tokenAmount / Math.pow(10, 18);
//     }

//     public async getTokenAmount(networkID: Networks, provider: StaticJsonRpcProvider) {
//         return this.getTreasuryBalance(networkID, provider);
//     }

//     public getSbAmount(networkID: Networks, provider: StaticJsonRpcProvider) {
//         return new Promise<number>(reserve => reserve(0));
//     }
// }

// // These are special bonds that have different valuation methods
// export interface CustomBondOpts extends StableBondOpts {}

// export class CustomBond extends StableBond {
//     constructor(customBondOpts: CustomBondOpts) {
//         super(customBondOpts);

//         // this.getTreasuryBalance = async (networkID: Networks, provider: StaticJsonRpcProvider) => {
//         //     const tokenAmount = await super.getTreasuryBalance(networkID, provider);
//         //     const tokenPrice = this.getTokenPrice();

//         //     return tokenAmount * tokenPrice;
//         // };
//     }
// }

// For stable bonds the display units are the same as the actual token
export class StableBond extends Bond {
    constructor(bondOptions: BondOptions) {
        super(bondOptions);
    }

    public initializeContracts({ bondAddress, reserveAddress }: BondAddresses, signer: JsonRpcSigner): void {
        this.bondContract = new Contract(bondAddress, LpBondContract, signer);
        this.reserveContract = new Contract(reserveAddress, LpReserveContract, signer);
    }

    public async getTreasuryBalance(bondCalculatorContract: Contract, treasuryAddress: string) {
        if (!this.reserveContract) throw new Error("Unable to get reserveContract");

        const tokenAmount = await this.reserveContract.balanceOf(treasuryAddress);

        return tokenAmount / Math.pow(10, 18);
    }

    public getTokenAmount() {
        console.warn("Not implemented");
        return Promise.resolve(0);
    }

    public getSbAmount(BASH_ADDRESS: string) {
        return Promise.resolve(0);
    }
}
