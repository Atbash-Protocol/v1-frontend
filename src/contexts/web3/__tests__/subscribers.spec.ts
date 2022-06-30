import { Web3Provider } from '@ethersproject/providers';
import * as EthersModule from 'ethers';

import { subscribeSigner, createSigner, subscribeProvider, resetWeb3Signer } from '../subscribers';
import { WEB3ActionTypesEnum } from '../web3.types';

class MockProvider extends Web3Provider {
    public constructor(provider: any) {
        super(provider, undefined);
    }
}

describe('#subscribeSigner', () => {
    let reloadMock: jest.Mock;

    beforeEach(() => {
        delete (window as any).location;
        reloadMock = jest.fn();

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.location = { reload: reloadMock };
    });

    it('subscribes correctly to close and network changes events', () => {
        const dispatch = jest.fn();
        const provider = jest.fn();

        const mockProvider = new MockProvider(provider);

        subscribeSigner(mockProvider as any, dispatch);

        mockProvider._events[0].listener.apply(this, [1234]);
        mockProvider._events[1].listener.apply(this, []);

        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenNthCalledWith(1, { type: WEB3ActionTypesEnum.NETWORK_CHANGED, payload: { signer: expect.anything(), networkId: 1234 } });
        expect(dispatch).toHaveBeenNthCalledWith(2, { type: WEB3ActionTypesEnum.CLOSE, payload: { signer: expect.anything() } });
        expect(reloadMock).toHaveBeenCalled();
    });
});

describe('#createSigner', () => {
    it('creates a signer', async () => {
        const web3ModalMock = {
            connect: jest.fn().mockResolvedValue({
                on: jest.fn(),
                once: jest.fn(),
            }),
        };
        const dispatch = jest.fn();

        const signerMock = {
            getNetwork: jest.fn().mockResolvedValue({ chainId: 1234 }),
            getSigner: () => ({
                getAddress: jest.fn().mockResolvedValue('0xAddress'),
            }),
        };

        jest.spyOn(EthersModule.providers, 'Web3Provider').mockImplementation(() => signerMock as any);

        await createSigner(web3ModalMock as any, dispatch as any);

        expect(web3ModalMock.connect).toHaveBeenCalled();
        expect(dispatch).toHaveBeenCalledWith({ type: WEB3ActionTypesEnum.SET_SIGNER, payload: { signer: expect.anything(), chainId: 1234, address: '0xAddress' } });
    });
});

describe('#subscribeProvider', () => {
    const providerMock = {
        on: jest.fn(),
        ready: { chainId: 1234 },
    };

    it('initiates a provider', async () => {
        jest.spyOn(EthersModule.providers, 'JsonRpcProvider').mockImplementation(() => providerMock as any);
        const dispatch = jest.fn();

        await subscribeProvider(dispatch);

        expect(dispatch).toHaveBeenCalledWith({ type: WEB3ActionTypesEnum.SET_PROVIDER, payload: { chainId: 1234, provider: providerMock } });
    });

    it('throws if the chainId is not available', async () => {
        jest.spyOn(EthersModule.providers, 'JsonRpcProvider').mockImplementation(() => ({ ...providerMock, ready: { chainId: null } } as any));

        await expect(subscribeProvider(jest.fn())).rejects.toThrow('Impossible to connect to the given');
    });
});

describe('#resetWeb3Signer', () => {
    it('resets correctly', () => {
        const dispatch = jest.fn();
        const web3ModalMock = { clearCachedProvider: jest.fn() };

        resetWeb3Signer(dispatch, web3ModalMock as any);

        expect(web3ModalMock.clearCachedProvider).toHaveBeenCalled();
        expect(dispatch).toHaveBeenCalled();
    });
});
