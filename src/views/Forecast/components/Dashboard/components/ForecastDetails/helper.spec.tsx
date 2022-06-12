import { computeDailyROI, getBashRewardsEstimation, getLamboEstimation, getPotentialReturn } from './helper';

describe('computeDailyROI', () => {
    it('returns the daily ROI', () => {
        const rewardYieldPercent = '100';
        const duration = 10; // 10 days

        expect(computeDailyROI(rewardYieldPercent, duration)).toEqual(1073741823);
    });
});

describe('getBashRewardsEstimation', () => {
    it('returns the bash rewards estimation', () => {
        const stakedSBAmount = '100';
        const dailyROI = 10;

        expect(getBashRewardsEstimation(stakedSBAmount, dailyROI)).toEqual(1000);
    });
});

describe('getPotentialReturn', () => {
    it('returns the potential returns', () => {
        const stakedSBAmount = '100';
        const bashRewardsEstimation = 10;
        const futureBASHMarketPrice = '200';

        expect(getPotentialReturn(stakedSBAmount, bashRewardsEstimation, futureBASHMarketPrice)).toEqual(22000);
    });
});

describe('getLamboEstimation', () => {
    it('returns the rounded lambo estimation', () => {
        const potentialReturn = 500000; // 1 Lambo is around 200k

        expect(getLamboEstimation(potentialReturn)).toEqual(2);
    });
});
