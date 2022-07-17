import { createDraftSafeSelector } from '@reduxjs/toolkit';
import Decimal from 'decimal.js';
import { TFunction } from 'i18next';
import { sum } from 'lodash';
import { createSelector } from 'reselect';

import { formatTimer } from 'helpers/prettify-seconds';
import { formatUSD, formatUSDFromDecimal } from 'helpers/price-units';
import { LPBond } from 'lib/bonds/bond/lp-bond';
import { StableBond } from 'lib/bonds/bond/stable-bond';
import { RootState } from 'store/store';

import { selectReserveLoading, useContractLoaded } from '../app/app.selectors';
import { selectMarketsLoading } from '../markets/markets.selectors';
import { selectIndex } from '../stake/stake.selectors';
import { BondItem, BondMetrics } from './bonds.types';

export const selectBondInstances = (state: RootState) => Object.values(state.bonds.bondInstances);

export const selectAllBonds = createDraftSafeSelector([selectBondInstances], bondInstances => {
    console.log(bondInstances);
    return Object.values(bondInstances).reduce(
        (acc, bondInstance) => {
            if (bondInstance.bondOptions.isActive === true) {
                return {
                    ...acc,
                    activeBonds: [...acc.activeBonds, bondInstance],
                };
            }

            return {
                ...acc,
                inactiveBonds: [...acc.inactiveBonds, bondInstance],
            };
        },
        { activeBonds: new Array<LPBond | StableBond>(), inactiveBonds: new Array<LPBond | StableBond>() },
    );
});

export const selectBondInfos = (bonds: Record<string, BondItem>, bondID: string): BondItem | null => {
    const bond = bonds[bondID];

    if (!bond) return null;

    return bond;
};

export const selectBondMintingMetrics = (metrics: BondMetrics) => {
    let bondPrice = null;

    bondPrice = formatUSD(Number(metrics.bondPrice) / 1e18, 2);

    return {
        bondPrice,
        allowance: metrics.allowance,
        maxBondPrice: metrics.maxBondPrice,
        vestingTerm: metrics.vestingTerm,
        bondDiscount: metrics.bondDiscount !== null ? `${metrics.bondDiscount.mul(100).toFixed(2)} %` : null,
        purchased: metrics.purchased !== null ? formatUSD(metrics.purchased) : null,
        bondSoldOut: (metrics.bondDiscount?.toNumber() ?? 0) * 100 < -30,
    };
};

export const selectBondPrice = (state: RootState, bondID: string) => {
    const metrics = state.bonds.bondMetrics[bondID];

    if (!metrics || metrics.bondPrice === null) return null;

    return formatUSDFromDecimal(new Decimal(metrics.bondPrice.toString()).div(10 ** 18), 2);
};

export const selectBondIsQuoting = (bonds: Record<string, BondItem>, bondID: string) => {
    const bond = bonds[bondID];

    if (!bond) throw new Error('Unable to get bond');

    return bond.metrics.loading ?? false;
};

export const selectBondQuoteResult = (
    {
        bonds: { bondQuote },
        main: {
            blockchain: { timestamp },
        },
    }: RootState,
    t: TFunction,
) => {
    return {
        interestDue: bondQuote.interestDue,
        vesting: timestamp === null || bondQuote.bondMaturationBlock === null ? null : formatTimer(timestamp ?? 0, bondQuote.bondMaturationBlock ?? 0, t),
        pendingPayout: bondQuote.pendingPayout,
    };
};

export const selectTreasuryBalanceLoading = (state: RootState) => state.bonds.treasuryBalance === null;

export const isAtLeastOneActive = (state: RootState) => Object.values(state.bonds.bonds).length > 0;

export const selectBonds = (state: RootState) => Object.values(state.bonds.bondMetrics);

export const selectMostProfitableBonds = createSelector([selectBonds], bonds => {
    const orderedBonds = bonds.sort((bond1, bond2): number => {
        if (bond1.bondDiscount === null || bond2.bondDiscount === null) return 0;

        return bond1.bondDiscount > bond2.bondDiscount ? 0 : 1;
    });

    return orderedBonds;
});

export const selectBondsReady = createSelector([selectBonds, useContractLoaded], (bonds, contractLoaded) => {
    return bonds.length > 0 && contractLoaded;
});

const selectBondCalculatorLoading = (state: RootState) => state.bonds.bondCalculator === null;

export const selectBondCalcDetailsReady = createSelector(
    [selectReserveLoading, selectMarketsLoading, selectBondCalculatorLoading],
    (reserveLoading, marketLoading, calcLoading) => {
        return !reserveLoading && !marketLoading && !calcLoading;
    },
);

// refactor

export const selectBondInstance = (state: RootState, bondId: string) => {
    const bond = state.bonds.bondInstances[bondId];

    if (!bond) return null;

    return bond;
};

export const selectBondMetricsReady = (state: RootState, bondId: string) => {
    const bondMetrics = state.bonds.bondMetrics[bondId];

    if (!bondMetrics) return false;

    return Object.values(bondMetrics).some(v => v !== null);
};

export const selectBondMetrics = (state: RootState, bondId: string) => {
    const bond = state.bonds.bondMetrics[bondId];

    if (!bond) return null;

    return { ...bond, bondPrice: new Decimal(bond.bondPrice?.toString() ?? 0) };
};

export const selectAllBondMetrics = (state: RootState) => state.bonds.bondMetrics;

export const selectBondDetailsCalcReady = createSelector([selectAllBondMetrics], bondMetrics => {
    const ready = Object.values(bondMetrics).some(v => v.bondPrice !== null);

    return ready;
});

export const selectFormattedTreasuryBalance = createSelector([selectAllBondMetrics], metrics => {
    const total = sum(
        Object.values(metrics)
            .map(m => m.treasuryBalance)
            .filter(Number),
    );

    return formatUSD(total, 2);
});

export const selectTreasuryReady = createSelector([selectAllBondMetrics], bondMetrics => {
    return Object.entries(bondMetrics)
        .map(([, bond]) => bond.treasuryBalance)
        .some(balance => balance !== null);
});

const selectCoreMetrics = (state: RootState) => state.bonds.coreMetrics;

export const selectFormattedBondCoreMetrics = createSelector([selectCoreMetrics, selectIndex], ({ rfv, runway }, currentIndex) => {
    const indexInGwei = new Decimal((currentIndex ?? 0).toString()).div(10 ** 9);
    const rfvBASH = new Decimal(rfv).mul(indexInGwei).toNumber();

    return {
        rfv: formatUSD(rfv),
        rfvBASH: formatUSD(rfvBASH),
        runway: new Decimal(runway).toFixed(1),
    };
});

export const selectAllActiveBondsIds = createSelector([selectAllBonds], ({ activeBonds }) => {
    return Object.values(activeBonds).map(({ ID }) => ID);
});
