import { providers } from 'ethers';
import Web3Modal from 'web3modal';

export interface WEB3State {
    networkID: number | null;
    provider: providers.JsonRpcProvider | null;
    signer: providers.Web3Provider | null;
    signerAddress: string | null;
    web3Modal: Web3Modal;
}

export interface IWeb3Context {
    state: WEB3State;
    memoConnect: () => void;
    memoDisconnect: (currentSigner: WEB3State['signer']) => Promise<void>;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload?: any; // TODO : better typing
}
