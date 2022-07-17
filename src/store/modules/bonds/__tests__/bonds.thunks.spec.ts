import Decimal from 'decimal.js';
import { BigNumber, ethers } from 'ethers';

import * as BondUtilsModule from 'store/modules/bonds/bonds.utils';

import { calcBondDetails, getBondTerms, getBondMetrics, initializeBonds } from '../bonds.thunks';

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

        const action = await calcBondDetails({ bondID: 'dai', value: 0 });
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

        const action = await calcBondDetails({ bondID: 'dai', value: 0 });
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

            const action = await calcBondDetails({ bondID: 'dai', value: 0 });
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

            const action = await calcBondDetails({ bondID: 'dai', value: 0 });
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
