import { JsonRpcProvider, JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { BondingCalcContract } from "abi";

import { BONDS } from "config/bonds";
import { getAddresses } from "constants/addresses";
import { messages } from "constants/messages";
import { ethers } from "ethers";
import { LPBond } from "lib/bonds/bond/lp-bond";
import { createBond, getBondContracts } from "lib/bonds/bonds.helper";
import _ from "lodash";
import { sum } from "lodash";
import { error } from "store/slices/messages-slice";
import { IReduxState } from "store/slices/state.interface";
import { initDefaultBondMetrics } from "./bonds.helper";
import { BondSlice } from "./bonds.types";

export const initializeBonds = createAsyncThunk("app/bonds", async (provider: JsonRpcProvider | Web3Provider): Promise<Pick<BondSlice, "bonds" | "bondCalculator">> => {
    const signer = provider.getSigner();
    const chainID = await signer.getChainId();

    // init bond calculator
    const { BASH_BONDING_CALC_ADDRESS } = getAddresses(chainID);

    const bondCalculator = new ethers.Contract(BASH_BONDING_CALC_ADDRESS, BondingCalcContract, signer);

    const bondstoOutput = BONDS.reduce((acc, bondConfig) => {
        const cBOND = createBond({ ...bondConfig, networkID: chainID });

        const contracts = getBondContracts(bondConfig, chainID);

        cBOND.initializeContracts(contracts, signer);

        return {
            ...acc,
            [_.snakeCase(bondConfig.name)]: {
                bondInstance: cBOND,
                metrics: initDefaultBondMetrics(),
            },
        };
    }, {} as BondSlice["bonds"]);

    return {
        bonds: bondstoOutput,
        bondCalculator,
    };
});

export const getTreasuryBalance = createAsyncThunk("bonds/bonds-treasury", async (chainID: number, { getState }) => {
    const {
        bonds: { bonds, bondCalculator },
    } = getState() as IReduxState;

    const { TREASURY_ADDRESS } = getAddresses(chainID);

    if (!bondCalculator) return { balance: null };

    const balances = await Promise.all(Object.values(bonds).map(({ bondInstance }) => bondInstance.getTreasuryBalance(bondCalculator, TREASURY_ADDRESS)));

    return {
        balance: sum(balances),
    };
});

export const calcBondDetails = createAsyncThunk(
    "bonds/calcBondDetails",
    async ({ bond, value, chainID }: { bond: LPBond; value: number; chainID: number }, { getState, dispatch }) => {
        if (!bond.getBondContract()) throw new Error("error init");

        const terms = await bond.getBondContract().terms();
        const maxBondPrice: number = await bond.getBondContract().maxPayout();

        const bondAmountInWei = ethers.utils.parseEther(value.toString());

        const state = getState() as IReduxState;

        const reserves = state.main.metrics.reserves;
        const { bondCalculator } = state.bonds;
        const daiPrice = state.markets.markets.dai;
        const { TREASURY_ADDRESS } = getAddresses(chainID);

        if (!reserves || !daiPrice || !bondCalculator) throw new Error("CalcBondDetailsError");

        const marketPrice = reserves.div(10 ** 9).toNumber() * daiPrice;

        const baseBondPrice = (await bond.getBondContract().bondPriceInUSD()) as ethers.BigNumber;

        const bondPrice = bond.isCustomBond() ? baseBondPrice.mul(daiPrice) : baseBondPrice;

        // = (reserve - bondPrice) / bondPrice
        const bondDiscount = reserves
            .mul(10 ** 9)
            .sub(bondPrice)
            .div(bondPrice)
            .toNumber();

        let maxBondPriceToken = 0;
        let bondQuote = 0;
        const maxBondValue = ethers.utils.parseEther("1");

        if (bond.isLP()) {
            const reserverAddress = bond.getBondAddresses().reserveAddress;

            const valuation = await bondCalculator.valuation(reserverAddress, bondAmountInWei);
            bondQuote = (await bond.getBondContract().payoutFor(valuation)) / 10 ** 9;

            const maxValuation = await bondCalculator.valuation(reserverAddress, maxBondValue); // TODO should be static ?
            const maxBondQuote = (await bond.getBondContract().payoutFor(maxValuation)) / 10 ** 9;

            maxBondPriceToken = maxBondPrice / (maxBondQuote / 10 ** 9);
        } else {
            bondQuote = (await bond.getBondContract().payoutFor(bondAmountInWei)) / 10 ** 18;

            maxBondPriceToken = maxBondPrice / 10 ** 18;
        }

        if (!!value && bondQuote > maxBondPrice) {
            dispatch(error({ text: messages.try_mint_more(maxBondPrice.toFixed(2).toString()) }));
        }

        const reverseContract = bond.getReserveContract();

        // let purchased = (await reverseContract.balanceOf(TREASURY_ADDRESS)).toNumber() as number;
        console.log(await reverseContract.balanceOf(TREASURY_ADDRESS));
        let purchased = 0;

        if (bond.isLP()) {
            const markdown = await bondCalculator.markdown(reverseContract.address);

            purchased = await bondCalculator.valuation(reverseContract.address, purchased);
            purchased = (markdown / Math.pow(10, 18)) * (purchased / Math.pow(10, 9));

            if (bond.isCustomBond()) {
                purchased = purchased * daiPrice;
            }
        } else {
            if (bond.isCustomBond()) {
                purchased = purchased / Math.pow(10, 18);
                purchased = purchased * daiPrice;
            }

            purchased = purchased / Math.pow(10, 18);
        }

        return {
            bond,
            bondDiscount,
            bondQuote,
            purchased,
            vestingTerm: Number(terms.vestingTerm), // Number(terms.vestingTerm),
            maxBondPrice,
            bondPrice, // bondPrice / Math.pow(10, 18),
            marketPrice,
            maxBondPriceToken,
        };
    },
);
