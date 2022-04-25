import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

export interface WEB3State {
    networkID: number | null;
    provider: ethers.providers.JsonRpcProvider | null;
    signer: ethers.providers.Web3Provider | null;
    signerAddress: string | null;
    web3Modal: Web3Modal;
}

export interface Web3Context {
    state: WEB3State;
    memoConnect: () => void;
    memoDisconnect: (signer: Web3Provider | null) => void;
}

export enum WEB3ActionTypesEnum {
    CLOSE = 'CLOSE',
    NETWORK_CHANGED = 'NETWORK_CHANGED',
    SET_SIGNER = 'SET_SIGNER',
    CLEAR_SIGNER = 'CLEAR_SIGNER',
    SET_PROVIDER = 'SET_PROVIDER',
}

export interface WEB3ContextAction {
    type: WEB3ActionTypesEnum;
    payload?: any; // TODO : better typing
}
