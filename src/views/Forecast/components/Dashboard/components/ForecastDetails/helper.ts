import { EPOCH_PER_DAY, LAMBO_PRICE } from 'views/Forecast/config';

export const computeDailyROI = (rewardYieldPercent: string, duration: number) => {
    return (1 + Number(rewardYieldPercent) / 100) ** (duration * EPOCH_PER_DAY) - 1;
};

export const getBashRewardsEstimation = (stakedSBAmount: string, dailyROI: number) => {
    return Number(stakedSBAmount) * dailyROI;
};

export const getPotentialReturn = (stakedSBAmount: string, bashRewardsEstimation: number, futureBASHMarketPrice: string) =>
    (Number(stakedSBAmount) + bashRewardsEstimation) * Number(futureBASHMarketPrice);

export const getLamboEstimation = (potentialReturn: number) => Math.round(potentialReturn / LAMBO_PRICE);
