import { LpReserveContract } from "abi";
import { Networks } from "constants/blockchain";
import { ethers } from "ethers";
import { BASHDAI } from "./bond";

const getMarketPrice = async (networkID: Networks, provider: ethers.Signer | ethers.providers.Provider): Promise<number> => {
    // LpReserveContract has .getReserves - gets the amounts in the pool for that pair (bash-dai)
    if (networkID == Networks.LOCAL) return (80 / 1) * 10 ** 9;

    const BASHDAIAddress = BASHDAI.getAddressForReserve(networkID);
    const pairContract = new ethers.Contract(BASHDAIAddress, LpReserveContract, provider);
    const reserves = await pairContract.getReserves();

    // const marketPrice = reserves[0] / reserves[1];
    // return marketPrice;
    return Number(reserves[1].toString()) / Number(reserves[0].toString());
};
