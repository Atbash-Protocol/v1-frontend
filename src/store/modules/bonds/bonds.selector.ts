import { formatUSD } from "helpers/price-units";
import { Bond } from "lib/bonds/bond/bond";
import { LPBond } from "lib/bonds/bond/lp-bond";
import { groupBy } from "lodash";
import { RootState } from "store/store";
import { BondItem, BondMetrics } from "./bonds.types";

export const selectActiveBonds = (state: RootState) => {
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
        { activeBonds: new Array<LPBond>(), inactiveBonds: new Array<LPBond>() },
    );
};

export const selectBondInfos = (bonds: Record<string, BondItem>, bondID: string): BondItem | null => {
    const bond = bonds[bondID];

    if (!bond) return null;

    return bond;
};

export const selectBondMintingMetrics = (metrics: BondMetrics) => {
    console.log(metrics);

    let bondPrice = null;

    try {
        console.log("here");
        bondPrice = formatUSD(Number(metrics.bondPrice) / 1e18, 2);
    } catch (err) {
        console.log("here err");
        console.error(err);
    }

    return {
        bondPrice,
        bondDiscount: metrics.bondDiscount !== null ? `${metrics.bondDiscount * 100} %` : null,
        purchased: metrics.purchased !== null ? formatUSD(metrics.purchased) : null,
    };
};
