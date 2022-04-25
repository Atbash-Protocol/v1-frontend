import { Dispatch } from 'react';

import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import Core from 'web3modal';

import { DEFAULT_NETWORK } from 'constants/blockchain';
import { getProviderURI } from 'contexts/web3/web3.utils';

import { WEB3ContextAction, WEB3ActionTypesEnum } from './web3.types';

export const subscribeSigner = async (web3provider: Web3Provider, dispatch: Dispatch<WEB3ContextAction>) => {
    web3provider.on('networkChanged', async (networkId: number) => {
        dispatch({ type: WEB3ActionTypesEnum.NETWORK_CHANGED, payload: { signer: web3provider.getSigner(), networkId } });
    });

    web3provider.once('close', () => {
        dispatch({ type: WEB3ActionTypesEnum.CLOSE, payload: { signer: web3provider.getSigner() } });
    });
};

export const createSigner = async (web3Modal: Core, dispatch: Dispatch<WEB3ContextAction>) => {
    const web3Provider = await web3Modal.connect();

    const signer = new Web3Provider(web3Provider);

    subscribeSigner(signer, dispatch);

    try {
        const [{ chainId }, address] = await Promise.all([signer.getNetwork(), signer.getSigner().getAddress()]);

        dispatch({ type: WEB3ActionTypesEnum.SET_SIGNER, payload: { signer, chainId, address } });
    } catch (err) {
        console.error(err);
    } finally {
    }
};

export const subscribeProvider = async (dispatch: Dispatch<WEB3ContextAction>) => {
    const provider = new JsonRpcProvider(getProviderURI(DEFAULT_NETWORK)).on('error', err => {
        alert('provider error');
        console.error(err);
    });

    try {
        const { chainId } = await provider.ready;

        if (!chainId) throw new Error('Impossible to connect to the given provider');

        dispatch({ type: WEB3ActionTypesEnum.SET_PROVIDER, payload: { chainId, provider } });
    } catch (err) {
        console.error('Provider error');
    }
};

export const resetWeb3Signer = async (dispatch: Dispatch<WEB3ContextAction>, web3Modal: Core): Promise<void> => {
    web3Modal.clearCachedProvider();
    localStorage.setItem('WEB3_CONNECT_CACHED_PROVIDER', '');
    dispatch({ type: WEB3ActionTypesEnum.CLOSE, payload: null });
};
