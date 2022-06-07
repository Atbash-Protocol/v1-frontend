import Decimal from 'decimal.js';
import { BigNumber } from 'ethers';
import { DateTime } from 'luxon';

import { Epoch } from 'store/modules/app/app.types';

import { selectCircSupply, selectStakingRewards, selectStakingReward, selectStakingRebaseAmount, selectStakingRebasePercentage } from '../metrics.selectors';

describe('#selectCircSupply', () => {
    it('returns the circ supply', () => {
        const circSupply = 1000;
        const state = { main: { metrics: { circSupply } } };

        expect(selectCircSupply(state as any)).toEqual(circSupply);
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
                metrics: { circSupply: 1200 },
            },
        };

        expect(selectStakingRebaseAmount(state as any)?.toString()).toEqual('0.83333333333333333333');
    });
});

describe('#selectStakingRebasePercentage', () => {
    it('returns the formatted percentage', () => {
        const state = {
            main: {
                staking: { epoch: { distribute: BigNumber.from(1000 * 10 ** 9) } },
                metrics: { circSupply: 1200 },
            },
        };

        expect(selectStakingRebasePercentage(state as any)?.toString()).toEqual('83.3333 %');
    });
});

describe('#selectStakingRewards', () => {
    it.each([
        { epoch: undefined, circSupply: undefined },
        { epoch: undefined, circSupply: 10 },
        { epoch: { number: BigNumber.from(0) }, circSupply: undefined },
    ])('returns null if metrics cant be computed', ({ epoch, circSupply }) => {
        expect(selectStakingRewards({ main: { staking: { epoch }, metrics: { circSupply } } } as any)).toEqual(null);
    });

    it('returns the rewards', () => {
        const epoch: Epoch = {
            distribute: BigNumber.from(10 * 10 ** 6),
            number: BigNumber.from(1),
            endTime: DateTime.utc().plus({ day: 2 }).toMillis(),
        };

        const circSupply = 120000;

        expect(selectStakingRewards({ main: { staking: { epoch }, metrics: { circSupply } } } as any)).toEqual({
            fiveDayRate: 0.0000015000010624999,
            stakingAPY: 0.0000912541596054194,
            stakingRebase: new Decimal('8.3333333333333333333e-8'),
            stakingReward: 8.333333333333334e-8,
        });
    });
});
