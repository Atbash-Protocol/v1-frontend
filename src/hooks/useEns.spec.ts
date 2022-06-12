import { renderHook } from '@testing-library/react-hooks';

import * as Web3ContextModule from 'contexts/web3/web3.context';

import useENS from './useENS';

describe('useENS', () => {
    it('does not try to lookup if provider is undefined', async () => {
        const providerMock = { lookupAddress: jest.fn().mockResolvedValue('Name') };
        jest.spyOn(Web3ContextModule, 'useWeb3Context').mockReturnValue({
            state: {
                provider: null,
                signerAddress: null,
            },
        } as any);

        const { result } = renderHook(() => useENS());

        expect(result.current).toEqual({ ensName: null });
    });

    it('returns the ENS if resolved by the provider', async () => {
        const providerMock = { lookupAddress: jest.fn().mockResolvedValue('Name') };
        jest.spyOn(Web3ContextModule, 'useWeb3Context').mockReturnValue({
            state: {
                provider: providerMock,
                signerAddress: '0x8789498681f4b0bc2f97552eb32b461b0b5c474e',
            },
        } as any);

        const { result, waitForNextUpdate } = renderHook(() => useENS());

        await waitForNextUpdate();

        expect(result.current).toEqual({ ensName: 'Name' });
    });
});
