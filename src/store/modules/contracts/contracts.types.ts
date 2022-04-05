import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";

export enum StakeActionEnum {
    STAKE = "STAKE",
    UNSTAKE = "UNSTAKE",
}

export interface ChangeStakeOptions {
    action: StakeActionEnum;
    address: string;
    value: number;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}
