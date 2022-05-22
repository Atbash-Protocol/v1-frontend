import { Networks } from 'constants/blockchain';

import { BondOptions } from './bond/bond';

export enum BondType {
    STABLE_ASSET,
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
    [Networks.MAINNET]?: BondAddresses;
    [Networks.RINKEBY]: BondAddresses;
    [Networks.LOCAL]: BondAddresses;
}

export type BondConfig = Omit<BondOptions, 'networkID'> & {
    addresses: NetworkAddresses;
    isActive?: boolean;
};
