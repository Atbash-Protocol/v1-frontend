import { JsonRpcProvider } from '@ethersproject/providers';
import { Dispatch } from '@reduxjs/toolkit';
import * as EthersModule from 'ethers';
import { DateTime } from 'luxon';

import { getBlockchainData, getCoreMetrics, getStakingMetrics, initializeProviderContracts } from '../app.thunks';

describe('#initializeProviderContracts', () => {
    it('throws an error if there is not signer nor provider', async () => {
        const dispatch = jest.fn();

        const action = await initializeProviderContracts({ provider: null, signer: null } as any);

        const res = await action(dispatch, () => {}, undefined);

        expect((res as any).error.message).toEqual('No provider or signer');
    });

    it('throws an error if the chainID is not found', async () => {
        const provider = {
            getNetwork: jest.fn().mockResolvedValue({ chainId: 'wrongID' }),
        };
        const dispatch: Dispatch = jest.fn();

        const action = await initializeProviderContracts({ provider } as any);
        const res = await action(dispatch, () => {}, undefined);

        expect((res as any).error.message).toEqual('Unable to initialize contracts');
    });

    it('throws an error if the provder or signer is not set', async () => {
        const signer = {
            getNetwork: jest.fn().mockResolvedValue({ chainId: 1 }),
            getSigner: jest.fn().mockResolvedValue(false),
        };
        const dispatch: Dispatch = jest.fn();

        const action = await initializeProviderContracts({ signer } as any);
        const res = await action(dispatch, () => {}, undefined);

        expect((res as any).error.message).toEqual('Unable to get a contract signer or provider');
    });

    describe('regarding the provider', () => {
        beforeEach(() => {
            // it's a bit tweaking but Contracts are inits with address, abi and signer
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            jest.spyOn(EthersModule, 'Contract').mockImplementation((address, _abi, signer) => {
                return { address, signer };
            });
        });

        it('initializes the contracts', async () => {
            const provider = {
                getNetwork: jest.fn().mockResolvedValue({ chainId: 1 }),
            };
            const dispatch: Dispatch = jest.fn();

            const action = await initializeProviderContracts({ provider } as any);

            const { payload } = await action(dispatch, () => {}, undefined);

            // ethers.Contracts are mocked
            expect(payload).toEqual({
                BASH_CONTRACT: { address: expect.any(String), signer: provider },
                DAI_CONTRACT: { address: expect.any(String), signer: provider },
                BASH_DAI_LP_ADDRESS: { address: expect.any(String), signer: provider },
                REDEEM_CONTRACT: { address: expect.any(String), signer: provider },
                SBASH_CONTRACT: { address: expect.any(String), signer: provider },
                STAKING_CONTRACT: { address: expect.any(String), signer: provider },
                STAKING_HELPER_ADDRESS: { address: expect.any(String), signer: provider },
                WSBASH_ADDRESS: { address: expect.any(String), signer: provider },
                ZAPIN_ADDRESS: { address: expect.any(String), signer: provider },
            });
        });
    });
});

describe('#getBlockchainData', () => {
    const dispatch = jest.fn();
    it('catches an error if provider is not defined', async () => {
        const action = await getBlockchainData(null);

        const res = await action(dispatch, () => {}, undefined);

        expect((res as any).error.message).toEqual('Unable to find provider');
    });

    it('returns the blockchain infos', async () => {
        const timestamp = DateTime.utc().toMillis();
        const currentBlock = 1;
        const provider = {
            getBlockNumber: jest.fn().mockResolvedValue(currentBlock),
            getBlock: jest.fn().mockResolvedValue({
                timestamp,
            }),
        };

        const action = await getBlockchainData(provider as any);

        const { payload } = await action(dispatch, () => {}, undefined);

        expect(payload).toEqual({ currentBlock, timestamp });
        expect(provider.getBlock).toHaveBeenCalledWith(currentBlock);
    });
});

describe('#getCoreMetrics', () => {
    const dispatch = jest.fn();

    it('catches an error if contracts are not defined', async () => {
        const getState = jest.fn().mockReturnValue({
            main: { contracts: {} },
        });
        const action = await getCoreMetrics();

        const res = await action(dispatch, getState, undefined);

        expect((res as any).error.message).toEqual('Unable to get coreMetrics');
    });

    it('returns the coreMetrics', async () => {
        const getState = jest.fn().mockReturnValue({
            main: {
                contracts: {
                    BASH_CONTRACT: {
                        totalSupply: jest.fn().mockResolvedValue(100000000),
                    },
                    SBASH_CONTRACT: {
                        circulatingSupply: jest.fn().mockResolvedValue(EthersModule.BigNumber.from(100000)),
                    },
                    BASH_DAI_LP_ADDRESS: {
                        getReserves: jest.fn().mockResolvedValue([EthersModule.ethers.BigNumber.from(10000), EthersModule.ethers.BigNumber.from(10000)]),
                    },
                },
            },
        });

        const action = await getCoreMetrics();
        const { payload } = await action(dispatch, getState, undefined);

        expect(payload).toEqual({
            circSupply: 0.0001,
            rawCircSupply: EthersModule.ethers.BigNumber.from(100000),
            totalSupply: 0.1,
            reserves: EthersModule.BigNumber.from(1),
        });
    });
});

describe('#getStakingMetrics', () => {
    const dispatch = jest.fn();

    it('catches an error if staking contract is not defined', async () => {
        const getState = jest.fn().mockReturnValue({
            main: { contracts: {} },
        });
        const action = await getStakingMetrics();

        const res = await action(dispatch, getState, undefined);

        expect((res as any).error.message).toEqual('Unable to get staking contract');
    });

    it('returns the metrics', async () => {
        const getState = jest.fn().mockReturnValue({
            main: {
                contracts: {
                    STAKING_CONTRACT: {
                        epoch: jest.fn().mockResolvedValue({
                            distribute: EthersModule.BigNumber.from(20000),
                            endTime: DateTime.utc().toMillis(),
                            number: EthersModule.BigNumber.from(1),
                        }),
                        index: jest.fn().mockResolvedValue(EthersModule.BigNumber.from(20)),
                    },
                },
            },
        });
        const action = await getStakingMetrics();

        const { payload } = await action(dispatch, getState, undefined);

        expect(payload).toEqual({
            epoch: { distribute: EthersModule.BigNumber.from(20000), endTime: expect.any(Number), number: EthersModule.BigNumber.from(1) },
            index: EthersModule.BigNumber.from(20),
            secondsToNextEpoch: 0,
        });
    });
});
