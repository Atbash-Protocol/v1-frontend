import Decimal from 'decimal.js';
import { BigNumber, ethers } from 'ethers';
import { DateTime } from 'luxon';

import { Epoch } from 'store/modules/app/app.types';

import { selectStakingRewards } from '../metrics.selectors';

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
