import { formatUSD } from "helpers/price-units";
import { LPBond } from "lib/bonds/bond/lp-bond";
import { RootState } from "store/store";
import { BondItem, BondMetrics } from "./bonds.types";

export const selectActiveBonds = (state: RootState): LPBond[] => {
    const { bonds } = state.bonds;

    return Object.values(bonds).flatMap(({ bondInstance }) => bondInstance);
    // return [state.bonds.bonds["bash_dai_lp"].bondInstance];
};

export const selectBondInfos = (bonds: Record<string, BondItem>, bondID: string): BondItem | null => {
    const bond = bonds[bondID];

    if (!bond) return null;

    return bond;
};

export const selectBondMintingMetrics = (metrics: BondMetrics) => {
    console.log(metrics);
    return {
        bondPrice: metrics.bondPrice !== null ? formatUSD(Number(metrics.bondPrice) / 1e18, 2) : null,
        bondDiscount: metrics.bondDiscount !== null ? `${metrics.bondDiscount * 100} %` : null,
        purchased: metrics.purchased !== null ? formatUSD(metrics.purchased) : null,
    };
};
