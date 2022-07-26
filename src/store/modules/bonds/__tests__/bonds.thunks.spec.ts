import Decimal from 'decimal.js';
import { BigNumber, constants, ethers } from 'ethers';
import { DateTime } from 'luxon';

import * as MetamaskErrorWrapModule from 'helpers/networks/metamask-error-wrap';
import * as AppThunkModule from 'store/modules/app/app.thunks';
import * as BondUtilsModule from 'store/modules/bonds/bonds.utils';
import * as MessageSliceModule from 'store/modules/messages/messages.slice';
import * as TransactionSliceModule from 'store/modules/transactions/transactions.slice';
import { TransactionTypeEnum } from 'store/modules/transactions/transactions.type';

import {
    calcBondDetails,
    getBondTerms,
    getBondMetrics,
    initializeBonds,
    getTreasuryBalance,
    approveBonds,
    calculateUserBondDetails,
    depositBond,
    redeemBond,
    loadBondBalancesAndAllowances,
} from '../bonds.thunks';

// mock the enums since they cant be used inside jest.mock
jest.mock('config/bonds', () => ({
    BONDS: [
        {
            name: 'test bond',
            displayName: 'Test bond LP',
            token: 'dai',
            iconPath: 'icon',
            lpProvider: 'uniswap',
            type: 1, // LP
            addresses: {
                [1]: {
                    bondAddress: '0x7bc06c482DEAd17c0e297aFbC32f6e63d3846650',
                    reserveAddress: '0x908B40ED87FCA620B101B3Cba2B4C640D11eF016',
                },
                [1337]: {
                    bondAddress: '0x7bc06c482DEAd17c0e297aFbC32f6e63d3846650',
                    reserveAddress: '0x908B40ED87FCA620B101B3Cba2B4C640D11eF016',
                },
                [4]: {
                    bondAddress: '0x7bc06c482DEAd17c0e297aFbC32f6e63d3846650',
                    reserveAddress: '0x908B40ED87FCA620B101B3Cba2B4C640D11eF016', // uniswapv2-"0xC35F84DBd48fcB0467ac3Ee2C4e37D848B8d3173",
                },
            },
            isActive: false,
        },
    ],
}));

jest.mock('ethers', () => ({
    ...jest.requireActual('ethers'),
    Contract: jest.fn(),
}));

describe('#initializeProviderContracts', () => {
    const dispatch = jest.fn();

    it('throws an error if there is not signer nor provider', async () => {
        const action = await initializeBonds(null as any);
        const res = await action(dispatch, () => {}, undefined);

        expect((res as any).error.message).toEqual('Bond initialization error');
    });

    it('returns the bonds', async () => {
        const provider = {
            getSigner: jest.fn().mockReturnValue({
                getChainId: jest.fn().mockResolvedValue(1),
            }),
        };

        const action = await initializeBonds(provider as any);
        const { payload } = await action(dispatch, () => {}, undefined);

        expect(payload).toEqual({
            bondCalculator: {},
            bondInstances: {
                test_bond: {
                    ID: 'test_bond',
                    LP_URL: '',
                    bondContract: {},
                    bondOptions: {
                        addresses: {
                            '1': { bondAddress: '0x7bc06c482DEAd17c0e297aFbC32f6e63d3846650', reserveAddress: '0x908B40ED87FCA620B101B3Cba2B4C640D11eF016' },
                            '1337': { bondAddress: '0x7bc06c482DEAd17c0e297aFbC32f6e63d3846650', reserveAddress: '0x908B40ED87FCA620B101B3Cba2B4C640D11eF016' },
                            '4': { bondAddress: '0x7bc06c482DEAd17c0e297aFbC32f6e63d3846650', reserveAddress: '0x908B40ED87FCA620B101B3Cba2B4C640D11eF016' },
                        },
                        displayName: 'Test bond LP',
                        iconPath: 'icon',
                        isActive: false,
                        lpProvider: 'uniswap',
                        name: 'test bond',
                        networkID: 1,
                        token: 'dai',
                        type: 1,
                    },
                    reserveContract: {},
                },
            },
            bondMetrics: {
                test_bond: {
                    allowance: null,
                    balance: null,
                    bondDiscount: null,
                    bondPrice: null,
                    bondQuote: null,
                    loading: false,
                    marketPrice: null,
                    maxBondPrice: null,
                    maxBondPriceToken: null,
                    purchased: null,
                    treasuryBalance: null,
                    vestingTerm: null,
                },
            },
        });
    });
});

describe('#getBondMetrics', () => {
    const dispatch = jest.fn();

    it('throws an error if metrics elements are not defined', async () => {
        const getState = jest.fn().mockReturnValue({ bonds: { bondMetrics: {} }, main: { contracts: {}, metrics: {}, staking: {} }, markets: { markets: {} } });

        const action = await getBondMetrics({ networkID: 1 });

        const payload = await action(dispatch, getState, undefined);

        expect((payload as any).error.message).toEqual('Missing metrics to compute bond metrics');
    });

    it('returns the metrics', async () => {
        const BashContractMock = {
            balanceOf: jest.fn().mockResolvedValue(BigNumber.from(12)),
        };
        const getState = jest.fn().mockReturnValue({
            bonds: {
                bondInstances: {
                    dai: {
                        isLP: () => false,
                        getSbAmount: () => 10,
                    },
                    dai_lp: {
                        isLP: () => true,
                        getSbAmount: () => 50,
                    },
                },
                bondMetrics: { dai: { treasuryBalance: 10000 }, dai_lp: { treasuryBalance: 5000 } },
                coreMetrics: {},
                bondCalculator: jest.fn(),
            },
            markets: {
                markets: {
                    dai: 1.01,
                },
            },
            main: {
                contracts: {
                    BASH_CONTRACT: BashContractMock,
                },
                metrics: {
                    totalSupply: 400,
                    circSupply: 3,
                    rawCircSupply: 300000000000,
                    reserves: BigNumber.from(40000000000),
                },
                staking: {
                    epoch: {
                        distribute: BigNumber.from(1000),
                    },
                },
            },
        });

        const action = await getBondMetrics({ networkID: 1 });

        const { payload } = await action(dispatch, getState, undefined);

        expect(payload).toEqual({
            deltaMarketPriceRfv: -9.88799999224321,
            rfv: 36.76470588494809,
            rfvTreasury: 12500,
            runway: 833487151.4097351,
            stakingRebase: 3.3333333333333334e-9,
        });
    });
});

describe('#calcBondDetails', () => {
    const dispatch = jest.fn();
    const networkID = 4;

    it('catches an error if the bond is not defined', async () => {
        const getState = jest.fn().mockReturnValue({
            bonds: {
                bondInstances: {
                    dai: {},
                },
                bondMetrics: {},
            },
            main: {},
            markets: {},
        });

        const action = await calcBondDetails({ bondID: 'dai', value: 0, networkID });
        const res = await action(dispatch, getState, undefined);

        expect((res as any).error.message).toEqual('Unable to get bondInfos');
    });

    it('catches an error if the state is not setted', async () => {
        const getState = jest.fn().mockReturnValue({
            bonds: {
                bondInstances: {
                    dai: {
                        getBondContract: jest.fn().mockReturnValue({}),
                    },
                },
                bondMetrics: {
                    dai: {
                        metrics: 1,
                    },
                },
            },
            main: {
                metrics: {
                    reserves: null,
                },
            },
            markets: { markets: { dai: null } },
        });

        const action = await calcBondDetails({ bondID: 'dai', value: 0, networkID });
        const res = await action(dispatch, getState, undefined);

        expect((res as any).error.message).toEqual('State is not setup for bonds');
    });

    describe('When the bondtype is LP', () => {
        let state: any;

        beforeEach(() => {
            state = {
                main: {
                    metrics: {
                        reserves: BigNumber.from('0xf'),
                    },
                },
                markets: {
                    markets: {
                        dai: 1.01,
                    },
                },
                bonds: {
                    bondCalculator: jest.fn(),
                },
            };

            jest.spyOn(BondUtilsModule, 'getLPBondQuote').mockResolvedValue({
                bondQuote: 20,
                maxBondPriceToken: 30,
            });

            jest.spyOn(BondUtilsModule, 'getLPPurchasedBonds').mockResolvedValue({
                purchased: 20,
            });
        });

        it('returns the bond details', async () => {
            const getState = jest.fn().mockReturnValue({
                ...state,
                bonds: {
                    ...state.bonds,
                    bondInstances: {
                        dai: {
                            getBondContract: jest.fn().mockReturnValue({
                                terms: jest.fn().mockReturnValue({
                                    vestingTerm: 1,
                                }),
                                maxPayout: jest.fn().mockReturnValue(ethers.BigNumber.from('0xff')),
                                bondPriceInUSD: jest.fn().mockReturnValue(BigNumber.from('0xf1')),
                            }),
                            getReserveContract: jest.fn().mockReturnValue({
                                balanceOf: jest.fn().mockResolvedValue(BigNumber.from(10000000)),
                            }),
                            isCustomBond: () => false,
                            isLP: () => true,
                        },
                    },
                    bondMetrics: {
                        dai: {
                            treasuryBalance: 0,
                        },
                    },
                },
            });

            const action = await calcBondDetails({ bondID: 'dai', value: 0, networkID });
            const { payload } = await action(dispatch, getState, undefined);

            expect(payload).toEqual({
                bondDiscount: new Decimal('62240662.900414937759'),
                bondID: 'dai',
                bondPrice: BigNumber.from('0xf1'),
                bondQuote: 20,
                marketPrice: 0,
                maxBondPrice: 2.55e-7,
                maxBondPriceToken: 30,
                purchased: 20,
                vestingTerm: 1,
            });
        });
    });

    describe('When the bondtype is not LP', () => {
        let state: any;

        beforeEach(() => {
            state = {
                main: {
                    metrics: {
                        reserves: BigNumber.from('0xf'),
                    },
                },
                markets: {
                    markets: {
                        dai: 1.01,
                    },
                },
                bonds: {
                    bondCalculator: jest.fn(),
                },
            };

            jest.spyOn(BondUtilsModule, 'getTokenBondQuote').mockResolvedValue({
                bondQuote: 20,
                maxBondPriceToken: 30,
            });

            jest.spyOn(BondUtilsModule, 'getTokenPurchaseBonds').mockResolvedValue({
                purchased: 20,
            });
        });

        it('returns the bond details', async () => {
            const getState = jest.fn().mockReturnValue({
                ...state,
                bonds: {
                    ...state.bonds,
                    bondInstances: {
                        dai: {
                            getBondContract: jest.fn().mockReturnValue({
                                terms: jest.fn().mockReturnValue({
                                    vestingTerm: 1,
                                }),
                                maxPayout: jest.fn().mockReturnValue(ethers.BigNumber.from('0xff')),
                                bondPriceInUSD: jest.fn().mockReturnValue(BigNumber.from('0xf1')),
                            }),
                            getReserveContract: jest.fn().mockReturnValue({
                                balanceOf: jest.fn().mockResolvedValue(BigNumber.from(10000000)),
                            }),
                            isCustomBond: () => false,
                            isLP: () => false,
                        },
                    },
                    bondMetrics: {
                        dai: {
                            treasuryBalance: 0,
                        },
                    },
                },
            });

            const action = await calcBondDetails({ bondID: 'dai', value: 0, networkID });
            const { payload } = await action(dispatch, getState, undefined);

            expect(payload).toEqual({
                bondDiscount: new Decimal('62240662.900414937759'),
                bondID: 'dai',
                bondPrice: BigNumber.from('0xf1'),
                bondQuote: 20,
                marketPrice: 0,
                maxBondPrice: 2.55e-7,
                maxBondPriceToken: 30,
                purchased: 20,
                vestingTerm: 1,
            });
        });
    });
});

describe('#getBondTerms', () => {
    const dispatch = jest.fn();

    it('catches an error when terms are not defined', async () => {
        const getState = jest.fn().mockReturnValue({
            bonds: {
                bondInstances: {},
                bondMetrics: {},
            },
            main: {},
            markets: {},
        });

        const action = await getBondTerms('dai');
        const res = await action(dispatch, getState, undefined);

        expect((res as any).error.message).toEqual('Bond not found');
    });

    it('returns the terms', async () => {
        const getState = jest.fn().mockReturnValue({
            bonds: {
                bondInstances: {
                    dai: {
                        getBondContract: jest.fn().mockReturnValue({
                            terms: jest.fn().mockReturnValue('terms'),
                        }),
                    },
                },
                bondMetrics: {},
            },
            main: {},
            markets: {},
        });

        const action = await getBondTerms('dai');
        const { payload } = await action(dispatch, getState, undefined);

        expect(payload).toEqual({ terms: 'terms' });
    });
});

describe('#getTreasuryBalance', () => {
    it('returns a default value if no bonds exists', async () => {
        const dispatch = jest.fn();
        const getState = jest.fn().mockReturnValue({ bonds: { bondInstances: {} } });

        const action = await getTreasuryBalance({ networkID: 1 });

        const payload = await action(dispatch, getState, undefined);
        expect((payload as any).error.message).toEqual('Unable to get bondCalculator');
    });

    it('returns the balances', async () => {
        const dispatch = jest.fn();
        const getState = jest.fn().mockReturnValue({
            bonds: {
                bondInstances: {
                    dai: {
                        getTreasuryBalance: jest.fn().mockResolvedValue('10000'),
                    },
                },
                bondCalculator: jest.fn(),
            },
        });

        const action = await getTreasuryBalance({ networkID: 1 });

        const { payload } = await action(dispatch, getState, undefined);
        expect(payload).toEqual({ dai: '10000' });
    });
});

describe('#approveBonds', () => {
    it('throws an error if bound is not found', async () => {
        const dispatch = jest.fn();
        const getState = jest.fn().mockReturnValue({ bonds: { bondInstances: {} } });

        const action = await approveBonds({ signer: jest.fn() as any, bondID: 'dai' });

        const payload = await action(dispatch, getState, undefined);
        expect((payload as any).error.message).toEqual('Bond not found');
    });

    describe('Regarding a ready state', () => {
        const mockAllowance = BigNumber.from('0xfffff');
        const gasPriceMock = BigNumber.from(10);

        it('creates an approve transaction', async () => {
            const signer = {
                getSigner: () => ({
                    getAddress: () => '0xAddress',
                }),
                getGasPrice: jest.fn().mockResolvedValue(gasPriceMock),
            } as any;
            const reserveContract = {
                approve: jest.fn().mockResolvedValue({
                    wait: jest.fn().mockResolvedValue({}),
                }),
                allowance: jest.fn().mockResolvedValue(mockAllowance),
            };

            const getState = jest.fn().mockReturnValue({
                bonds: {
                    bondInstances: {
                        dai: {
                            getBondAddresses: jest.fn().mockReturnValue({ bondAddress: '0xAddress' }),
                            getReserveContract: jest.fn().mockReturnValue(reserveContract),
                        },
                    },
                },
            });
            const clearPendingTransactionSpy = jest.spyOn(TransactionSliceModule, 'clearPendingTransaction');
            const addNotificationSpy = jest.spyOn(MessageSliceModule, 'addNotification');
            const dispatch = jest.fn();

            const action = await approveBonds({ signer, bondID: 'dai' });
            const { payload } = await action(dispatch, getState, undefined);

            expect(payload).toEqual({ allowance: mockAllowance });
            expect(reserveContract.approve).toHaveBeenCalledWith('0xAddress', constants.MaxUint256, { gasPrice: gasPriceMock });
            expect(addNotificationSpy).toHaveBeenCalledWith({ description: 'Your transaction was successfully sent', severity: 'success' });
            expect(clearPendingTransactionSpy).toHaveBeenCalledWith(TransactionTypeEnum.APPROVE_CONTRACT);
        });

        describe('When the transactions returns an error', () => {
            it('handles the error', async () => {
                const metamaskErrorWrapSpy = jest.spyOn(MetamaskErrorWrapModule, 'metamaskErrorWrap').mockReturnThis();
                const signer = {
                    getSigner: () => ({
                        getAddress: () => '0xAddress',
                    }),
                    getGasPrice: jest.fn().mockResolvedValue(gasPriceMock),
                } as any;
                const reserveContract = {
                    approve: jest.fn().mockResolvedValue({
                        wait: jest.fn().mockRejectedValue({}),
                    }),
                    allowance: jest.fn().mockResolvedValue(mockAllowance),
                };

                const getState = jest.fn().mockReturnValue({
                    bonds: {
                        bondInstances: {
                            dai: {
                                getBondAddresses: jest.fn().mockReturnValue({ bondAddress: '0xAddress' }),
                                getReserveContract: jest.fn().mockReturnValue(reserveContract),
                            },
                        },
                    },
                });
                const dispatch = jest.fn();

                const action = await approveBonds({ signer, bondID: 'dai' });
                const { payload } = await action(dispatch, getState, undefined);

                expect(metamaskErrorWrapSpy).toHaveBeenCalled();
            });
        });
    });
});

describe('#calculateUserBondDetails', () => {
    describe('when the state is not ready', () => {
        it('throws an error', async () => {
            const dispatch = jest.fn();
            const getState = jest.fn().mockReturnValue({
                main: {
                    blockchain: { timestamp: 100 },
                },
                bonds: { bondInstances: {} },
            });

            const action = await calculateUserBondDetails({ signerAddress: '0x', signer: jest.fn() as any, bondID: 'bondID' });

            const payload = await action(dispatch, getState, undefined);
            expect((payload as any).error.message).toEqual('Unable to quote');
        });
    });

    describe('When the state is ready', () => {
        let state = {};

        const curDate = DateTime.utc();

        const lastBlockTime = Math.round(curDate.toSeconds());
        beforeEach(() => {
            state = {
                main: {
                    blockchain: { timestamp: Math.round(curDate.minus({ seconds: 200 }).toSeconds()) },
                },
                bonds: {
                    bondInstances: {
                        dai: {
                            getBondContract: jest.fn(() => ({
                                bondInfo: jest.fn().mockResolvedValue({
                                    payout: BigNumber.from(1000),
                                    vesting: BigNumber.from(10),
                                    lastTime: lastBlockTime,
                                }),
                                pendingPayoutFor: jest.fn().mockResolvedValue(BigNumber.from(1)),
                            })),
                        },
                    },
                },
            };
        });

        it('quotes the bond', async () => {
            const dispatch = jest.fn();
            const getState = jest.fn().mockReturnValue(state);
            const spy = jest.spyOn(AppThunkModule, 'getBlockchainData');

            const action = await calculateUserBondDetails({ signerAddress: '0x', signer: jest.fn() as any, bondID: 'dai' });
            const { payload } = await action(dispatch, getState, undefined);

            expect(payload).toEqual({ bondMaturationBlock: lastBlockTime + 10, bondVesting: 210, interestDue: 0.000001, pendingPayout: 1e-9 });
            expect(spy).toHaveBeenCalled();
        });
    });
});

describe('#depositBond', () => {
    describe('When the state is not ready', () => {
        it.each([
            { bondInstances: {}, bondMetrics: {} },
            { bondInstances: { dai: {} }, bondMetrics: {} },
            { bondInstances: {}, bondMetrics: { dai: {} } },
        ])('throws an error if metrics or instances is not found', async ({ bondInstances, bondMetrics }) => {
            const dispatch = jest.fn();
            const getState = jest.fn().mockReturnValue({
                bonds: {
                    bondInstances,
                    bondMetrics,
                },
            });

            const action = await depositBond({ amount: 10, recipientAddress: '0xRecipient', signerAddress: '0x', signer: jest.fn() as any, bondID: 'dai' });

            const payload = await action(dispatch, getState, undefined);
            expect((payload as any).error.message).toEqual('Unable to get bonds');
        });

        it('throws an error if bondPrice does not exists', async () => {
            const dispatch = jest.fn();
            const getState = jest.fn().mockReturnValue({
                bonds: {
                    bondInstances: {
                        dai: {
                            getBondContract: jest.fn(),
                        },
                    },
                    bondMetrics: { dai: {} },
                },
            });

            const action = await depositBond({ amount: 10, recipientAddress: '0xRecipient', signerAddress: '0x', signer: jest.fn() as any, bondID: 'dai' });

            const payload = await action(dispatch, getState, undefined);
            expect((payload as any).error.message).toEqual('Unable to get bondPrice');
        });
    });

    describe('When the state is ready', () => {
        let state = {};

        beforeEach(() => {
            state = {
                bonds: {
                    bondInstances: {
                        dai: {
                            getBondContract: jest.fn(() => ({
                                deposit: jest.fn().mockResolvedValue({
                                    hash: '0xDepositHash',
                                    wait: jest.fn().mockResolvedValue({}),
                                }),
                                bondPrice: jest.fn().mockResolvedValue(BigNumber.from(100)),
                                estimateGas: { deposit: jest.fn() },
                            })),
                        },
                    },
                    bondMetrics: { dai: { bondPrice: BigNumber.from(10) } },
                },
            };
        });

        it('mints the bond', async () => {
            const dispatch = jest.fn();
            const getState = jest.fn().mockReturnValue(state);
            const signer = {
                getSigner: () => ({
                    getAddress: () => '0xAddress',
                }),
                getGasPrice: jest.fn().mockResolvedValue(BigNumber.from(10)),
            } as any;
            const addPendingTransactionSpy = jest.spyOn(TransactionSliceModule, 'addPendingTransaction');
            const messageSpy = jest.spyOn(MessageSliceModule, 'addNotification');
            const addNotificationSpy = jest.spyOn(TransactionSliceModule, 'addPendingTransaction');
            const clearNotificationSpy = jest.spyOn(TransactionSliceModule, 'addPendingTransaction');

            const action = await depositBond({ amount: 10, recipientAddress: '0xRecipient', signerAddress: '0x', signer, bondID: 'dai' });
            const { payload } = await action(dispatch, getState, undefined);

            expect(payload).toBeUndefined();
            expect(addPendingTransactionSpy).toHaveBeenCalledWith({ hash: '0xDepositHash', type: 'BONDING' });
            expect(messageSpy).toHaveBeenNthCalledWith(1, {
                description: 'Your transaction was successfully sent',
                severity: 'success',
            });
            expect(messageSpy).toHaveBeenNthCalledWith(2, {
                description: 'Your balance will update soon',
                severity: 'info',
            });
            expect(addNotificationSpy).toHaveBeenCalled();
            expect(clearNotificationSpy).toHaveBeenCalled();
        });

        describe('Regarding errors', () => {
            it('handles mint errors correctly', async () => {
                const dispatch = jest.fn();
                const getState = jest.fn().mockReturnValue(
                    (state = {
                        bonds: {
                            bondInstances: {
                                dai: {
                                    getBondContract: jest.fn(() => ({
                                        deposit: jest.fn().mockResolvedValue({
                                            hash: '0xDepositHash',
                                            wait: jest.fn().mockRejectedValue({}),
                                        }),
                                        bondPrice: jest.fn().mockResolvedValue(BigNumber.from(100)),
                                        estimateGas: { deposit: jest.fn() },
                                    })),
                                },
                            },
                            bondMetrics: { dai: { bondPrice: BigNumber.from(10) } },
                        },
                    }),
                );
                const signer = {
                    getSigner: () => ({
                        getAddress: () => '0xAddress',
                    }),
                    getGasPrice: jest.fn().mockResolvedValue(BigNumber.from(10)),
                } as any;
                const metamaskErrorWrapSpy = jest.spyOn(MetamaskErrorWrapModule, 'metamaskErrorWrap');
                const messageSpy = jest.spyOn(MessageSliceModule, 'addNotification');
                const addNotificationSpy = jest.spyOn(TransactionSliceModule, 'addPendingTransaction');
                const clearNotificationSpy = jest.spyOn(TransactionSliceModule, 'addPendingTransaction');

                const action = await depositBond({ amount: 10, recipientAddress: '0xRecipient', signerAddress: '0x', signer, bondID: 'dai' });
                await action(dispatch, getState, undefined);

                expect(metamaskErrorWrapSpy).toHaveBeenCalled();
                expect(addNotificationSpy).toHaveBeenCalled();
                expect(clearNotificationSpy).toHaveBeenCalled();
            });
        });
    });
});

describe('#loadBondBalancesAndAllowances', () => {
    it('throws an error if bond does not exists', async () => {
        const dispatch = jest.fn();
        const getState = jest.fn().mockReturnValue({ bonds: { bondInstances: {} } });

        const action = await loadBondBalancesAndAllowances({ address: '0x', bondID: 'dai' });

        const payload = await action(dispatch, getState, undefined);
        expect((payload as any).error.message).toEqual('Bond not found');
    });

    it('returns the balances and allowances', async () => {
        const bondContractMock = { address: '0xBondContract' };
        const reserveContractMock = {
            allowance: jest.fn().mockResolvedValue(BigNumber.from('10000')),
            balanceOf: jest.fn().mockResolvedValue(BigNumber.from('10')),
        };
        const dispatch = jest.fn();
        const getState = jest.fn().mockReturnValue({
            bonds: {
                bondInstances: {
                    dai: {
                        getBondContract: () => bondContractMock,
                        getReserveContract: () => reserveContractMock,
                    },
                },
            },
        });

        const action = await loadBondBalancesAndAllowances({ address: '0x', bondID: 'dai' });

        const { payload } = await action(dispatch, getState, undefined);
        expect(payload).toEqual({ ID: undefined, allowance: BigNumber.from('10000'), balance: BigNumber.from('10') });
    });
});

describe('#Redeem', () => {
    describe('When the state is not ready', () => {
        it('throws an error if metrics or instances is not found', async () => {
            const dispatch = jest.fn();
            const getState = jest.fn().mockReturnValue({
                bonds: {
                    bondInstances: {},
                },
            });

            const action = await redeemBond({ recipientAddress: '0xRecipient', isAutoStake: true, signer: jest.fn() as any, bondID: 'dai' });

            const payload = await action(dispatch, getState, undefined);
            expect((payload as any).error.message).toEqual('Unable to get bondID from bondInstances');
        });
    });

    describe('When the state is ready', () => {
        let state = {};

        beforeEach(() => {
            state = {
                bonds: {
                    bondInstances: {
                        dai: {
                            getBondContract: jest.fn(() => ({
                                redeem: jest.fn().mockResolvedValue({
                                    hash: '0xDepositHash',
                                    wait: jest.fn().mockResolvedValue({}),
                                }),
                                bondPrice: jest.fn().mockResolvedValue(BigNumber.from(100)),
                                estimateGas: { redeem: jest.fn() },
                            })),
                        },
                    },
                    bondMetrics: { dai: { bondPrice: BigNumber.from(10) } },
                },
            };
        });

        it('redeems the bond', async () => {
            const dispatch = jest.fn();
            const getState = jest.fn().mockReturnValue(state);
            const signer = {
                getSigner: () => ({
                    getAddress: () => '0xAddress',
                }),
                getGasPrice: jest.fn().mockResolvedValue(BigNumber.from(10)),
            } as any;
            const addPendingTransactionSpy = jest.spyOn(TransactionSliceModule, 'addPendingTransaction');
            const messageSpy = jest.spyOn(MessageSliceModule, 'addNotification');
            const addNotificationSpy = jest.spyOn(TransactionSliceModule, 'addPendingTransaction');
            const clearNotificationSpy = jest.spyOn(TransactionSliceModule, 'addPendingTransaction');

            const action = await redeemBond({ isAutoStake: false, recipientAddress: '0xRecipient', signer, bondID: 'dai' });
            const { payload } = await action(dispatch, getState, undefined);

            expect(payload).toBeUndefined();
            expect(addPendingTransactionSpy).toHaveBeenCalledWith({ hash: '0xDepositHash', type: 'REDEEMING' });
            expect(messageSpy).toHaveBeenNthCalledWith(1, {
                description: 'Your transaction was successfully sent',
                severity: 'success',
            });
            expect(messageSpy).toHaveBeenNthCalledWith(2, {
                description: 'Your balance will update soon',
                severity: 'info',
            });
            expect(addNotificationSpy).toHaveBeenCalled();
            expect(clearNotificationSpy).toHaveBeenCalled();
        });

        describe('Regarding errors', () => {
            it('handles mint errors correctly', async () => {
                const dispatch = jest.fn();
                const getState = jest.fn().mockReturnValue(
                    (state = {
                        bonds: {
                            bondInstances: {
                                dai: {
                                    getBondContract: jest.fn(() => ({
                                        redeem: jest.fn().mockResolvedValue({
                                            hash: '0xredeemHash',
                                            wait: jest.fn().mockRejectedValue({}),
                                        }),
                                        bondPrice: jest.fn().mockResolvedValue(BigNumber.from(100)),
                                        estimateGas: { redeem: jest.fn() },
                                    })),
                                },
                            },
                            bondMetrics: { dai: { bondPrice: BigNumber.from(10) } },
                        },
                    }),
                );
                const signer = {
                    getSigner: () => ({
                        getAddress: () => '0xAddress',
                    }),
                    getGasPrice: jest.fn().mockResolvedValue(BigNumber.from(10)),
                } as any;
                const metamaskErrorWrapSpy = jest.spyOn(MetamaskErrorWrapModule, 'metamaskErrorWrap');
                const messageSpy = jest.spyOn(MessageSliceModule, 'addNotification');
                const addNotificationSpy = jest.spyOn(TransactionSliceModule, 'addPendingTransaction');
                const clearNotificationSpy = jest.spyOn(TransactionSliceModule, 'addPendingTransaction');

                const action = await redeemBond({ recipientAddress: '0xRecipient', isAutoStake: true, signer, bondID: 'dai' });
                await action(dispatch, getState, undefined);

                expect(metamaskErrorWrapSpy).toHaveBeenCalled();
                expect(addNotificationSpy).toHaveBeenCalled();
                expect(clearNotificationSpy).toHaveBeenCalled();
            });
        });
    });
});
