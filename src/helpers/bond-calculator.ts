import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../constants/blockchain";
import { BondingCalcContract } from "../abi";
import { ethers } from "ethers";
import { getAddressesAsync } from "../constants/addresses";

export async function getBondCalculator(networkID: Networks, provider: StaticJsonRpcProvider) {
    // const addresses = getAddresses(networkID);
    const addresses = await getAddressesAsync(networkID);
    return new ethers.Contract(addresses.BASH_BONDING_CALC_ADDRESS, BondingCalcContract, provider);
}
