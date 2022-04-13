import { ethers } from "ethers";
import { LpReserveContract } from "../abi";
import { BASHDAI } from "../helpers/bond";
import { DEFAULT_NETWORK, Networks } from "../constants/blockchain";

export async function getMarketPrice(pairContract: ethers.Contract): Promise<number> {
    // LpReserveContract has .getReserves - gets the amounts in the pool for that pair (bash-dai)

    // if (networkID == Networks.LOCAL) return (80 / 1) * 10 ** 9;

    // const BASHDAIAddress = BASHDAI.getAddressForReserve(networkID);
    // const pairContract = new ethers.Contract(BASHDAIAddress, LpReserveContract, provider);
    const reserves = await pairContract.getReserves();

    return Number(reserves[1].toString()) / Number(reserves[0].toString());
}
