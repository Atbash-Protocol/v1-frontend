import { Contract, ethers } from 'ethers';

import { LPBond } from 'lib/bonds/bond/lp-bond';
import { StableBond } from 'lib/bonds/bond/stable-bond';

export const getLPBondQuote = async (bond: LPBond | StableBond, bondAmountInWei: ethers.BigNumber, bondCalculator: Contract, maxBondPrice: number) => {
    const reserverAddress = bond.getBondAddresses().reserveAddress;
    const maxBondValue = ethers.utils.parseEther('1');

    const valuation = await bondCalculator.valuation(reserverAddress, bondAmountInWei);
    const bondQuote = (await bond.getBondContract().payoutFor(valuation)) / 10 ** 9;

    const maxValuation = await bondCalculator.valuation(reserverAddress, maxBondValue); // TODO should be static ?
    const maxBondQuote = (await bond.getBondContract().payoutFor(maxValuation)) / 10 ** 9;

    const maxBondPriceToken = maxBondPrice / (maxBondQuote / 10 ** 9);

    return { bondQuote, maxBondPriceToken };
};

export const getTokenBondQuote = async (bond: LPBond | StableBond, bondAmountInWei: ethers.BigNumber, maxBondPrice: number) => {
    const bondQuote = (await bond.getBondContract().payoutFor(bondAmountInWei)) / 10 ** 18;

    const maxBondPriceToken = maxBondPrice / 10 ** 18;

    return { bondQuote, maxBondPriceToken };
};

export const getLPPurchasedBonds = async (bond: LPBond | StableBond, bondCalculator: ethers.Contract, initialPurchased: number, daiPrice: number) => {
    const reverseContract = bond.getReserveContract();
    const markdown = await bondCalculator.markdown(reverseContract.address);

    let purchased = await bondCalculator.valuation(reverseContract.address, initialPurchased);
    purchased = (markdown / Math.pow(10, 18)) * (purchased / Math.pow(10, 9));

    if (bond.isCustomBond()) {
        purchased = purchased * daiPrice;
    }

    return { purchased };
};

export const getTokenPurchaseBonds = async (bond: LPBond | StableBond, bondCalculator: ethers.Contract, initialPurchased: number, daiPrice: number) => {
    let purchased = initialPurchased / Math.pow(10, 18);

    if (bond.isCustomBond()) {
        purchased = purchased * daiPrice;
    }

    return { purchased };
};
