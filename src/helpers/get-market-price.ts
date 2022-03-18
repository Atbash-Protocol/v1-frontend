import { ethers } from "ethers";
import { LpReserveContract } from "../abi";
import { BASHUSDC } from "../helpers/bond";
import { Networks } from "../constants/blockchain";

export async function getMarketPrice(networkID: Networks, provider: ethers.Signer | ethers.providers.Provider): Promise<number> {
    // const BASHUSDCAddress = BASHUSDC.getAddressForReserve(networkID);
    // const pairContract = new ethers.Contract(BASHUSDCAddress, LpReserveContract, provider);
    // const reserves = await pairContract.getReserves();
    // const marketPrice = reserves[0] / reserves[1];
    // return marketPrice;
    console.warn("disabled: getMarketPrice");
    return 10000000000;
}
