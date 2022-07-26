import Decimal from 'decimal.js';
import { BigNumber } from 'ethers';
import { DateTime } from 'luxon';

import { Epoch } from 'store/modules/app/app.types';

import {
    selectRawCircSupply,
    selectStakingRewards,
    selectStakingReward,
    selectTVL,
    selectStakingRebaseAmount,
    selectStakingRebasePercentage,
    selectTotalBalance,
    selectFormattedMarketCap,
    selectWSBASHPrice,
} from '../metrics.selectors';

describe('#selectRawCircSupply', () => {
    it('returns the circ supply', () => {
        const rawCircSupply = 1000;
        const state = { main: { metrics: { rawCircSupply } } };

        expect(selectRawCircSupply(state as any)).toEqual(rawCircSupply);
    });
});

describe('#selectStakingReward', () => {
    it.each([
        { epoch: null, expected: null },
        { epoch: { distribute: null }, expected: null },
        { epoch: { distribute: BigNumber.from(1000) }, expected: BigNumber.from(1000) },
    ])('returns the staking reward', ({ epoch, expected }) => {
        const state = { main: { staking: { epoch } } };

        expect(selectStakingReward(state as any)).toEqual(expected);
    });
});

describe('#selectStakingRebaseAmount', () => {
    it.each([
        { circSupply: null, stakingReward: null },
        { circSupply: 1000, stakingReward: null },
        { circSupply: null, stakingReward: BigNumber.from(100) },
    ])('returns null when  circSupply is $circSupply and stakingReward is $stakingReward', ({ circSupply, stakingReward }) => {
        const state = { main: { staking: { epoch: { distribute: stakingReward } }, metrics: { circSupply } } };

        expect(selectStakingRebaseAmount(state as any)).toEqual(null);
    });

    it('returns the stakingRebase amount', () => {
        const state = {
            main: {
                staking: { epoch: { distribute: BigNumber.from(1000 * 10 ** 9) } },
                metrics: { rawCircSupply: 1200 },
            },
        };

        expect(selectStakingRebaseAmount(state as any)?.toString()).toEqual('833333333.33333333333');
    });
});

describe('#selectStakingRebasePercentage', () => {
    it('returns the staking rebase percentage', () => {
        const state = {
            main: {
                staking: { epoch: { distribute: BigNumber.from(1000 * 10 ** 9) } },
                metrics: { rawCircSupply: 1200 },
            },
        };

        expect(selectStakingRebasePercentage(state as any)?.toString()).toEqual('83333333333.333333333');
    });
});

describe('#selectStakingRewards', () => {
    it.each([
        { epoch: undefined, rawCircSupply: undefined },
        { epoch: undefined, rawCircSupply: 10 },
        { epoch: { number: BigNumber.from(0) }, rawCircSupply: undefined },
    ])('returns null if metrics cant be computed', ({ epoch, rawCircSupply }) => {
        expect(selectStakingRewards({ main: { staking: { epoch }, metrics: { rawCircSupply } } } as any)).toEqual(null);
    });

    it('returns the rewards', () => {
        const epoch: Epoch = {
            distribute: BigNumber.from(10 * 10 ** 6),
            number: BigNumber.from(1),
            endTime: DateTime.utc().plus({ day: 2 }).toMillis(),
        };

        const rawCircSupply = 1200000000;

        expect(selectStakingRewards({ main: { staking: { epoch }, metrics: { rawCircSupply } } } as any)).toEqual({
            fiveDayRate: 0.13256,
            stakingAPY: 8840.29893,
            stakingRebase: new Decimal('0.0083333333333333333333'),
            stakingReward: 0.008333333333333333,
        });
    });
});

describe('#selectTVL', () => {
    const state = {
        main: {
            metrics: {},
        },
        markets: {
            markets: {
                dai: null,
            },
        },
    };
    it.each([
        { circSupply: null, marketPrice: null },
        { circSupply: null, marketPrice: 10 },
    ])('returns null of circSUpply or marketPrice is null', ({ circSupply }) => {
        expect(selectTVL({ ...state, main: { metrics: { circSupply } } } as any)).toBeNull();
    });

    it('returns 0 if TVL computation is null', () => {
        expect(selectTVL({ ...state, main: { metrics: { circSupply: 10 } }, markets: { markets: { dai: null } } } as any)).toEqual(new Decimal(0));
    });

    it('returns the TVL', () => {
        expect(selectTVL({ ...state, main: { metrics: { circSupply: 1000000000000000, reserves: BigNumber.from(10000) } }, markets: { markets: { dai: 1.01 } } } as any)).toEqual(
            new Decimal(10100000000),
        );
    });
});

describe('#selectTotalBalance', () => {
    it('returns the total balance', () => {
        const state = {
            markets: { markets: { dai: 1.02 } },
            account: {
                balances: {
                    BASH: BigNumber.from(10 * 10 ** 9),
                    SBASH: BigNumber.from(100 * 10 ** 9),
                },
            },
        };

        expect(selectTotalBalance(state as any)).toEqual('$112.20');
    });
});

describe('#selectFormattedMarketCap', () => {
    it.each([
        { totalSupply: null, reserves: null },
        { totalSupply: 10000, reserves: null },
        { totalSupply: null, reserves: BigNumber.from(10000) },
    ])('returns null if totalSupply or reserves is null', ({ totalSupply, reserves }) => {
        const state = {
            main: {
                metrics: {
                    totalSupply,
                    reserves,
                },
            },
        };

        expect(selectFormattedMarketCap(state as any)).toBeNull();
    });

    it('returns the market cap', () => {
        const state = {
            main: {
                metrics: {
                    totalSupply: 1_000_000,
                    reserves: BigNumber.from(10 * 10 ** 9),
                },
            },
        };

        expect(selectFormattedMarketCap(state as any)).toBe('$10,000,000.00');
    });
});

describe('#selectWSBASHPrice', () => {
    it.each([
        { index: null, dai: null },
        { index: null, dai: 1.01 },
    ])('returns null if marketPrice or index is null', ({ index, dai }) => {
        const state = {
            main: {
                metrics: {
                    totalSupply: 1_000_000,
                    reserves: BigNumber.from(10 * 10 ** 9),
                },
                staking: {
                    index,
                },
            },
            markets: { markets: { dai } },
        };

        expect(selectWSBASHPrice(state as any)).toBeNull();
    });

    it('returns the WSBASH Price', () => {
        const state = {
            main: {
                metrics: {
                    totalSupply: 1_000_000,
                    reserves: BigNumber.from(10 * 10 ** 9),
                },
                staking: {
                    index: BigNumber.from(2 * 10 ** 9),
                },
            },
            markets: { markets: { dai: 1.01 } },
        };

        expect(selectWSBASHPrice(state as any)).toBe('$20.20');
    });
});
