import { JsonRpcProvider } from "@ethersproject/providers";
import { StakingContract, LpReserveContract, RedeemContract, MemoTokenContract, TimeTokenContract } from "abi";
import { getAddresses } from "constants/addresses";
import { Contract } from "ethers";
import { ContractEnum } from "./app.types";

export const initializeProviderContracts = ({ networkID, provider }: { networkID: number; provider: JsonRpcProvider }): { [key in ContractEnum]?: Contract } => {
    const addresses = getAddresses(networkID);

    return {
        [ContractEnum.STAKING_ADDRESS]: new Contract(addresses.STAKING_ADDRESS, StakingContract, provider),
        [ContractEnum.INITIAL_PAIR_ADDRESS]: new Contract(addresses.INITIAL_PAIR_ADDRESS, LpReserveContract, provider),
        [ContractEnum.REDEEM_ADDRESS]: new Contract(addresses.REDEEM_ADDRESS, RedeemContract, provider),
        [ContractEnum.SBASH_ADDRESS]: new Contract(addresses.SBASH_ADDRESS, MemoTokenContract, provider),
        [ContractEnum.BASH]: new Contract(addresses.BASH_ADDRESS, TimeTokenContract, provider),
        [ContractEnum.DAI_ADDRESS]: new Contract(addresses.DAI_ADDRESS, TimeTokenContract, provider),
    };
};

export const getCoreMetrics = async (BASHContract: Contract) => {
    return {
        totalSupply: await BASHContract.getTotalSupply(),
    };
};
