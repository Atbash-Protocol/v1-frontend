import { getTreasuryBalance, initializeBonds } from '../bonds.thunks';

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

describe('#getTreasuryBalance', () => {
    const dispatch = jest.fn();

    it('returns 0 if no instances or no bondCalculator', async () => {
        const getState = jest.fn().mockReturnValue({
            bonds: { bondInstances: [], bondCalculator: null },
        });

        const action = await getTreasuryBalance({ networkID: 1 });

        const { payload } = await action(dispatch, getState, undefined);

        expect(payload).toEqual({ balance: 0 });
    });

    it('returns the bondInstance balance', async () => {
        const testBond = {
            getTreasuryBalance: jest.fn().mockResolvedValue(10000),
        };
        const getState = jest.fn().mockReturnValue({
            bonds: { bondInstances: { dai: testBond }, bondCalculator: jest.fn() },
        });

        const action = await getTreasuryBalance({ networkID: 1 });

        const { payload } = await action(dispatch, getState, undefined);

        expect(payload).toEqual({ dai: 10000 });
    });
});
