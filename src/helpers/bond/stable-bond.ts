import { ContractInterface } from 'ethers';
import { Bond, BondOpts } from './bond';
import { BondType } from './constants';
import { Networks } from '../../constants/blockchain';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { getAddressesAsync } from '../../constants/addresses';

export interface StableBondOpts extends BondOpts {
    readonly reserveContractAbi: ContractInterface;
}

export class StableBond extends Bond {
    readonly isLP = false;
    readonly reserveContractAbi: ContractInterface;
    readonly displayUnits: string;

    constructor(stableBondOpts: StableBondOpts) {
        super(BondType.StableAsset, stableBondOpts);

        // For stable bonds the display units are the same as the actual token
        this.displayUnits = stableBondOpts.displayName;
        this.reserveContractAbi = stableBondOpts.reserveContractAbi;
    }

    public async getTreasuryBalance(networkID: Networks, provider: StaticJsonRpcProvider) {
        // const addresses = getAddresses(networkID);
        const addresses = await getAddressesAsync(networkID);
        const token = await this.getContractForReserve(networkID, provider);
        const tokenAmount = await token.balanceOf(addresses.TREASURY_ADDRESS);
        return tokenAmount / Math.pow(10, 18);
    }

    public async getTokenAmount(networkID: Networks, provider: StaticJsonRpcProvider) {
        return this.getTreasuryBalance(networkID, provider);
    }

    public getBashAmount(networkID: Networks, provider: StaticJsonRpcProvider) {
        return new Promise<number>(reserve => reserve(0));
    }

    public async getAddressForBond(networkID: Networks): Promise<string> {
        return (await getAddressesAsync(networkID)).DAI_BOND_ADDRESS;
    }

    public async getAddressForReserve(networkID: Networks): Promise<string> {
        return (await getAddressesAsync(networkID)).DAI_ADDRESS;
    }
}

// These are special bonds that have different valuation methods
export interface CustomBondOpts extends StableBondOpts {}

export class CustomBond extends StableBond {
    constructor(customBondOpts: CustomBondOpts) {
        super(customBondOpts);

        this.getTreasuryBalance = async (networkID: Networks, provider: StaticJsonRpcProvider) => {
            const tokenAmount = await super.getTreasuryBalance(networkID, provider);
            const tokenPrice = this.getTokenPrice();

            return tokenAmount * tokenPrice;
        };
    }

    public async getAddressForBond(networkID: Networks): Promise<string> {
        // return (await getAddressesAsync(networkID)).DAI_BOND_ADDRESS;
        throw 'Not configured for this bond';
    }

    public async getAddressForReserve(networkID: Networks): Promise<string> {
        // return (await getAddressesAsync(networkID)).DAI_ADDRESS;
        throw 'Not configured for this bond';
    }
}
