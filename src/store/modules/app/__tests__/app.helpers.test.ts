import Decimal from 'decimal.js';
import { ethers } from 'ethers';
import { DateTime } from 'luxon';

import { calculateStakingRewards } from '../app.helpers';
import { Epoch } from '../app.types';

describe('#calculateStakingRewards', () => {
    it('returns the staking rewards', () => {
        const epoch: Epoch = {
            distribute: ethers.BigNumber.from(12 * 10 ** 9),
            endTime: DateTime.utc().plus({ days: 10 }).toMillis(),
            number: ethers.BigNumber.from(1),
        };
        const circSupply = 1_000;

        const rewards = calculateStakingRewards(epoch, circSupply);

        expect(rewards).toStrictEqual({
            fiveDayRate: 0.19593530706071682,
            stakingAPY: 470510.04374622693,
            stakingRebase: new Decimal('0.012'),
            stakingReward: new Decimal('12000000000'),
        });
    });
});
