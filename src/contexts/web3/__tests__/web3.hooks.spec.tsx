import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { DEFAULT_NETWORK } from 'constants/blockchain';
import * as WEB3Context from 'contexts/web3/web3.context';

import { useGoodNetworkCheck, useProvider, useSafeSigner, useSignerAddress, useSignerConnected, useWeb3ContextInitialized } from '../web3.hooks';

describe('#useGoodNetworkCheck', () => {
    it.each([
        { networkID: DEFAULT_NETWORK, expected: true },
        { networkID: 1000, expected: false },
    ])('returns $expected if network is $networkID', ({ networkID, expected }) => {
        jest.spyOn(WEB3Context, 'useWeb3Context').mockReturnValue({
            state: { networkID },
        } as any);

        const {
            result: { current },
        } = renderHook(() => useGoodNetworkCheck());

        expect(current).toEqual(expected);
    });
});

describe('#useSignerConnected', () => {
    it.each([
        { networkID: -1000, signer: null, expected: false },
        { networkID: DEFAULT_NETWORK, signer: null, expected: false },
        { networkID: null, signer: 'signer', expected: true },
        { networkID: -1000, signer: 'signer', expected: true },
        { networkID: DEFAULT_NETWORK, signer: 'signer', expected: true },
    ])('returns $expected if network is $networkID and signer $signer', ({ networkID, signer, expected }) => {
        jest.spyOn(WEB3Context, 'useWeb3Context').mockReturnValue({
            state: { networkID, signer },
        } as any);

        const {
            result: { current },
        } = renderHook(() => useSignerConnected());

        expect(current).toEqual(expected);
    });
});

describe('#useWeb3ContextInitialized', () => {
    it.each([
        { networkID: null, signer: null, provider: null, expected: false },
        { networkID: DEFAULT_NETWORK, signer: null, provider: null, expected: false },
        { networkID: DEFAULT_NETWORK, signer: null, provider: 'provider', expected: true },
        { networkID: DEFAULT_NETWORK, signer: 'signer', provider: null, expected: true },
    ])('returns $expected if network is $networkID, provider : $provider, signer : $signer', ({ networkID, signer, provider, expected }) => {
        jest.spyOn(WEB3Context, 'useWeb3Context').mockReturnValue({
            state: { networkID, signer, provider },
        } as any);

        const {
            result: { current },
        } = renderHook(() => useWeb3ContextInitialized());

        expect(current).toEqual(expected);
    });
});

describe('#useSignerAddress', () => {
    it.each([
        { signerAddress: null, expected: null },
        { signerAddress: 'signerAddress', expected: 'signerAddress' },
    ])('returns $expected if signerAddress is $signerAddress', ({ signerAddress, expected }) => {
        jest.spyOn(WEB3Context, 'useWeb3Context').mockReturnValue({
            state: { signerAddress },
        } as any);

        const {
            result: { current },
        } = renderHook(() => useSignerAddress());

        expect(current).toEqual(expected);
    });
});

describe('#useProvider', () => {
    it.each([
        { provider: null, expected: null },
        { provider: 'provider', expected: 'provider' },
    ])('returns $expected if provider is $provider', ({ provider, expected }) => {
        jest.spyOn(WEB3Context, 'useWeb3Context').mockReturnValue({
            state: { provider },
        } as any);

        const {
            result: { current },
        } = renderHook(() => useProvider());

        expect(current).toEqual(expected);
    });
});

describe('#useSafeSigner', () => {
    it.each([
        { signer: null, signerAddress: null },
        { signer: 'signer', signerAddress: null },
        { signer: null, signerAddress: 'signerAddress' },
    ])('throws an error if signer or signerAddress is undefined', ({ signer, signerAddress }) => {
        const dispatch = jest.fn();
        jest.spyOn(WEB3Context, 'useWeb3Context').mockReturnValue({
            state: { signer, signerAddress },
        } as any);

        const {
            result: { error },
        } = renderHook(() => useSafeSigner(dispatch));
        expect(error).toBeDefined();
        expect(dispatch).toHaveBeenCalled();
    });

    it('returns the signer', () => {
        const dispatch = jest.fn();
        jest.spyOn(WEB3Context, 'useWeb3Context').mockReturnValue({
            state: { signer: 'signer', signerAddress: 'signerAddress' },
        } as any);

        const {
            result: { current },
        } = renderHook(() => useSafeSigner(dispatch));

        expect(current).toEqual({ signer: 'signer', signerAddress: 'signerAddress' });
    });
});
