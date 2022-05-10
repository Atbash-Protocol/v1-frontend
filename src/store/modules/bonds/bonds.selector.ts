import { TFunction } from 'i18next';

import { formatTimer } from 'helpers/prettify-seconds';
import { formatUSD } from 'helpers/price-units';
import { LPBond } from 'lib/bonds/bond/lp-bond';
import { StableBond } from 'lib/bonds/bond/stable-bond';
import { RootState } from 'store/store';

import { BondItem, BondMetrics } from './bonds.types';

export const selectAllBonds = (state: RootState) => {
    const { bonds } = state.bonds;

    return Object.values(bonds).reduce(
        (acc, { bondInstance }) => {
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
};

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
        bondDiscount: metrics.bondDiscount !== null ? `${metrics.bondDiscount * 100} %` : null,
        purchased: metrics.purchased !== null ? formatUSD(metrics.purchased) : null,
    };
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

export const selectTreasuryBalance = (state: RootState) => formatUSD(state.bonds.treasuryBalance || 0, 2);

export const isAtLeastOneActive = (state: RootState) => Object.values(state.bonds.bonds).length > 0;
