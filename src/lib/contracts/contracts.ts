import { TimeTokenContract } from "abi";
// TODO : See later if we need to export the contract logic inside a lib
enum ContractEnum {
    BASH = "BASH",
    SBASH_ADDRESS = "SBASH_ADDRESS",
    DAI_ADDRESS = "DAI_ADDRESS",
    STAKING_ADDRESS = "STAKING_ADDRESS",
    INITIAL_PAIR_ADDRESS = "INITIAL_PAIR_ADDRESS",
    REDEEM_ADDRESS = "REDEEM_ADDRESS",
}

export const activeContracts: { contractKey: ContractEnum; abi: unknown }[] = [
    {
        contractKey: ContractEnum.BASH,
        abi: TimeTokenContract,
    },
];

export const ERC20_DECIMALS = 9;
