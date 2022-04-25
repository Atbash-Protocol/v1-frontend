import { JsonRpcSigner } from '@ethersproject/providers';

import { ActiveTokensEnum } from 'config/tokens';
import { Networks } from 'constants/blockchain';

import { BondOptions } from './bond/bond';

export enum BondType {
    StableAsset,
    LP,
    CUSTOM,
}

export enum BondProviderEnum {
    UNISWAP_V2 = 'https://app.uniswap.org/#/add/v2',
}

export interface BondAddresses {
    reserveAddress: string;
    bondAddress: string;
}

export interface NetworkAddresses {
    [Networks.MAINNET]?: BondAddresses; // TODO : Remove optional in PROD
    [Networks.RINKEBY]: BondAddresses;
    [Networks.LOCAL]: BondAddresses;
}

// TODO : can be extended from BondOptions

export type BondConfig = Omit<BondOptions, 'networkID'> & {
    addresses: NetworkAddresses;
    isActive?: boolean;
};
