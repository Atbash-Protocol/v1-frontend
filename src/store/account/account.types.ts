import { StaticJsonRpcProvider, JsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "constants/index";
import { Bond } from "helpers/bond/bond";
import { IToken } from "helpers/tokens";

export interface IGetBalances {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

export interface IAccountBalances {
    balances: {
        wsBASH: string;
        sBASH: string;
        BASH: string;
    };
}

export interface ILoadAccountDetails {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

export interface IUserAccountDetails {
    balances: {
        BASH: string;
        sBASH: string;
        wsBASH: string;
    };
    redeeming: {
        BASH: number;
    };
    staking: {
        BASH: number;
        sBASH: number;
    };
    wrapping: {
        sBASHAllowance: number;
    };
}

export interface ICalcUserBondDetails {
    address: string;
    bond: Bond;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
}

export interface ICalcUserTokenDetails {
    address: string;
    token: IToken;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
}

export interface IAccountSlice {
    bonds: { [key: string]: IUserBondDetails };
    balances: {
        wsBASH: string;
        sBASH: string;
        BASH: string;
    };
    loading: boolean;
    redeeming: {
        BASH: number;
    };
    staking: {
        BASH: number;
        sBASH: number;
    };
    wrapping: {
        sBASHAllowance: number;
    };
    tokens: { [key: string]: IUserTokenDetails };
}

export interface IUserTokenDetails {
    allowance: number;
    balance: number;
    isAvax?: boolean;
}

export interface IUserBondDetails {
    allowance: number;
    balance: number;
    avaxBalance: number;
    interestDue: number;
    bondMaturationBlock: number;
    pendingPayout: number; //Payout formatted in gwei.
}
