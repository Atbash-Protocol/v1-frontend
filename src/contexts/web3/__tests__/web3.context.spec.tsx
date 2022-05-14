import { render } from '@testing-library/react';

import * as SubscriberModule from '../subscribers';
import { Web3ContextProvider, WEB3Reducer } from '../web3.context';
import * as Web3ContextModule from '../web3.context';
import { WEB3ActionTypesEnum } from '../web3.types';

const Dummy = () => (
    <Web3ContextProvider>
        <> </>
    </Web3ContextProvider>
);

describe('Web3ContextProvider', () => {
    it('initializes the state', () => {
        jest.spyOn(Web3ContextModule, 'useWeb3Context').mockReturnValue({
            state: {
                web3Modal: {
                    on: jest.fn(),
                    cachedProvider: 'cached',
                },
            },
        } as any);

        const resetWeb3SignerMock = jest.spyOn(SubscriberModule, 'resetWeb3Signer').mockReturnThis();
        const subscribeProviderMock = jest.spyOn(SubscriberModule, 'subscribeProvider').mockReturnThis();

        render(<Dummy />);

        expect(subscribeProviderMock).toHaveBeenCalled();
    });
});

describe('#WEB3Reducer', () => {
    const state = {
        signer: null,
        signerAddress: null,
        provider: null,
        networkID: null,
        web3Modal: () => {},
    };

    it('reduces the default', () => {
        expect(WEB3Reducer(state as any, { type: 'unknowns' as any })).toEqual(state);
    });

    it('resets', () => {
        expect(WEB3Reducer({ ...state, signer: 'signer' } as any, { type: WEB3ActionTypesEnum.CLOSE as any })).toEqual({ ...state, signer: null, web3Modal: expect.anything() });
    });

    it('changes the network', () => {
        expect(WEB3Reducer({ ...state, networkID: null } as any, { type: WEB3ActionTypesEnum.NETWORK_CHANGED, payload: { networkId: '1' } })).toEqual({
            ...state,
            networkID: 1,
        });
    });

    it('sets the signer', () => {
        expect(
            WEB3Reducer({ ...state, networkID: null, signer: null, signerAddress: null } as any, {
                type: WEB3ActionTypesEnum.SET_SIGNER,
                payload: { chainId: 1, signer: 'signer', address: '0xAddress' },
            }),
        ).toEqual({
            ...state,
            networkID: 1,
            signer: 'signer',
            signerAddress: '0xAddress',
        });
    });

    it('sets the provider', () => {
        expect(
            WEB3Reducer({ ...state, networkID: null, provider: null } as any, {
                type: WEB3ActionTypesEnum.SET_PROVIDER,
                payload: { chainId: 1, provider: 'provider' },
            }),
        ).toEqual({
            ...state,
            networkID: 1,
            provider: 'provider',
        });
    });
});
