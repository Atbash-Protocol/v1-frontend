import { Networks } from '../../constants/blockchain';

export enum BondType {
    STABLE_ASSET,
    LP,
}

export interface BondAddresses {
    reserveAddress: string;
    bondAddress: string;
}

export interface NetworkAddresses {
    [Networks.MAINNET]: BondAddresses;
    [Networks.RINKEBY]: BondAddresses;
    [Networks.LOCAL]: BondAddresses;
}
