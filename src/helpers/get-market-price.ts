import { ethers } from "ethers";
import { LpReserveContract } from "../abi";
import { BASHDAI } from "../helpers/bond";
import { Networks } from "../constants/blockchain";
import { getAddresses, getAddressesAsync } from "constants/addresses";

export async function getMarketPrice(networkID: Networks, provider: ethers.Signer | ethers.providers.Provider): Promise<number> {
    // LpReserveContract has .getReserves - gets the amounts in the pool for that pair (bash-dai)
    const BASHDAIAddress = await BASHDAI.getAddressForReserve(networkID);
    const pairContract = new ethers.Contract(BASHDAIAddress, LpReserveContract, provider);
    const reserves = await pairContract.getReserves();
    const addresses = await getAddressesAsync(networkID);
    const token0 = await pairContract.token0();
    const reserve0 = Number(reserves[0].toString());
    const reserve1 = Number(reserves[1].toString());

    return token0 == addresses.BASH_ADDRESS ? reserve1 / reserve0 : reserve0 / reserve1;
}
