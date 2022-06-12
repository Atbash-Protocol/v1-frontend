import { ethers } from "ethers";
import { getAddressesAsync } from "../../constants";
import { TimeTokenContract as BashTokenContract, MemoTokenContract as SBashTokenContract, MimTokenContract } from "../../abi";
import { setAll } from "../../helpers";

import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
    IGetBalances,
    IAccountBalances,
    ILoadAccountDetails,
    IUserAccountDetails,
    ICalcUserBondDetails,
    ICalcUserTokenDetails,
    IUserTokenDetails,
    IUserBondDetails,
} from "../account/account.types";

export const getBalances = createAsyncThunk("account/getBalances", async ({ address, networkID, provider }: IGetBalances): Promise<IAccountBalances> => {
    // const addresses = getAddresses(networkID);
    const addresses = await getAddressesAsync(networkID);

    const sBASHContract = new ethers.Contract(addresses.SBASH_ADDRESS, SBashTokenContract, provider);
    const wsBASHContract = new ethers.Contract(addresses.WSBASH_ADDRESS, SBashTokenContract, provider);
    const sBASHBalance = await sBASHContract.balanceOf(address);
    const wsBASHBalance = await wsBASHContract.balanceOf(address);
    const bashContract = new ethers.Contract(addresses.BASH_ADDRESS, BashTokenContract, provider);
    const BASHbalance = await bashContract.balanceOf(address);
    const aBashContract = new ethers.Contract(addresses.ABASH_ADDRESS, SBashTokenContract, provider); // todo: fix contract
    const aBashBalance = await aBashContract.balanceOf(address);
    return {
        balances: {
            wsBASH: ethers.utils.formatEther(wsBASHBalance),
            sBASH: ethers.utils.formatUnits(sBASHBalance, "gwei"),
            BASH: ethers.utils.formatUnits(BASHbalance, "gwei"),
            aBash: ethers.utils.formatUnits(aBashBalance),
        },
    };
});

export const loadAccountDetails = createAsyncThunk("account/loadAccountDetails", async ({ networkID, provider, address }: ILoadAccountDetails): Promise<IUserAccountDetails> => {
    let BASHbalance = 0;
    let sBASHBalance = 0;
    let wsBASHBalance = 0;
    let stakeAllowance = 0;
    let unstakeAllowance = 0;
    let wrapAllowance = 0;
    let redeemAllowance = 0;
    let aBashBalance = 0;
    let aBashRedeemAllowance = 0;

    // const addresses = getAddresses(networkID);
    const addresses = await getAddressesAsync(networkID);

    if (addresses.BASH_ADDRESS) {
        const sbContract = new ethers.Contract(addresses.BASH_ADDRESS, BashTokenContract, provider);
        BASHbalance = await sbContract.balanceOf(address);
        stakeAllowance = await sbContract.allowance(address, addresses.STAKING_HELPER_ADDRESS);
        // disable: redeemAllowance = await sbContract.allowance(address, addresses.REDEEM_ADDRESS);
    }

    if (addresses.SBASH_ADDRESS) {
        const sBASHContract = new ethers.Contract(addresses.SBASH_ADDRESS, SBashTokenContract, provider);
        sBASHBalance = await sBASHContract.balanceOf(address);
        wrapAllowance = await sBASHContract.allowance(address, addresses.WSBASH_ADDRESS);
        unstakeAllowance = await sBASHContract.allowance(address, addresses.STAKING_ADDRESS);
    }

    if (addresses.WSBASH_ADDRESS) {
        const wsBASHContract = new ethers.Contract(addresses.WSBASH_ADDRESS, SBashTokenContract, provider);
        wsBASHBalance = await wsBASHContract.balanceOf(address);
    }

    if (addresses.ABASH_ADDRESS) {
        const abashContract = new ethers.Contract(addresses.ABASH_ADDRESS, MimTokenContract, provider); // todo: use abash contract
        aBashBalance = await abashContract.balanceOf(address);
        aBashRedeemAllowance = await abashContract.allowance(address, addresses.PRESALE_REDEMPTION_ADDRESS);
    }

    return {
        balances: {
            wsBASH: ethers.utils.formatEther(wsBASHBalance),
            sBASH: ethers.utils.formatUnits(sBASHBalance, "gwei"),
            BASH: ethers.utils.formatUnits(BASHbalance, "gwei"),
            aBash: ethers.utils.formatUnits(aBashBalance),
        },
        redeeming: {
            BASH: Number(redeemAllowance),
            aBash: Number(aBashRedeemAllowance),
        },
        staking: {
            BASH: Number(stakeAllowance),
            sBASH: Number(unstakeAllowance),
        },
        wrapping: {
            sBASHAllowance: Number(wrapAllowance),
        },
    };
});

export const calculateUserBondDetails = createAsyncThunk("account/calculateUserBondDetails", async ({ address, bond, networkID, provider }: ICalcUserBondDetails) => {
    // console.warn("disabled: calculateUserBondDetails");
    // return new Promise<any>(resevle => {
    //     resevle({
    //         bond: "",
    //         displayName: "",
    //         bondIconSvg: "",
    //         isLP: false,
    //         allowance: 0,
    //         balance: 0,
    //         interestDue: 0,
    //         bondMaturationBlock: 0,
    //         pendingPayout: "",
    //         avaxBalance: 0,
    //     });
    // });

    if (!address) {
        return new Promise<any>(resevle => {
            resevle({
                bond: "",
                displayName: "",
                bondIconSvg: "",
                isLP: false,
                allowance: 0,
                balance: 0,
                interestDue: 0,
                bondMaturationBlock: 0,
                pendingPayout: "",
                avaxBalance: 0,
            });
        });
    }

    const bondContract = await bond.getContractForBond(networkID, provider);
    const reserveContract = await bond.getContractForReserve(networkID, provider);

    let interestDue, pendingPayout, bondMaturationBlock;

    const bondDetails = await bondContract.bondInfo(address);
    interestDue = bondDetails.payout / Math.pow(10, 9);
    bondMaturationBlock = Number(bondDetails.vesting) + Number(bondDetails.lastTime);
    pendingPayout = await bondContract.pendingPayoutFor(address);

    let allowance,
        balance = "0";

    allowance = await reserveContract.allowance(address, bond.getAddressForBond(networkID));
    balance = await reserveContract.balanceOf(address);
    const balanceVal = ethers.utils.formatEther(balance);

    const avaxBalance = await provider.getSigner().getBalance();
    const avaxVal = ethers.utils.formatEther(avaxBalance);

    const pendingPayoutVal = ethers.utils.formatUnits(pendingPayout, "gwei");

    return {
        bond: bond.name,
        displayName: bond.displayName,
        bondIconSvg: bond.bondIconSvg,
        isLP: bond.isLP,
        allowance: Number(allowance),
        balance: Number(balanceVal),
        avaxBalance: Number(avaxVal),
        interestDue,
        bondMaturationBlock,
        pendingPayout: Number(pendingPayoutVal),
    };
});

export const calculateUserTokenDetails = createAsyncThunk("account/calculateUserTokenDetails", async ({ address, token, networkID, provider }: ICalcUserTokenDetails) => {
    console.warn("disabled: calculateUserTokenDetails");
    return new Promise<any>(resevle => {
        resevle({
            token: "",
            address: "",
            img: "",
            allowance: 0,
            balance: 0,
        });
    });
    if (!address) {
        return new Promise<any>(resevle => {
            resevle({
                token: "",
                address: "",
                img: "",
                allowance: 0,
                balance: 0,
            });
        });
    }

    if (token.isAvax) {
        const avaxBalance = await provider.getSigner().getBalance();
        const avaxVal = ethers.utils.formatEther(avaxBalance);

        return {
            token: token.name,
            tokenIcon: token.img,
            balance: Number(avaxVal),
            isAvax: true,
        };
    }

    // disabled: ZAPIN not supported
    // const addresses = getAddresses(networkID);
    // const addresses = await getAddressesAsync(networkID);

    // const tokenContract = new ethers.Contract(token.address, MimTokenContract, provider);

    // let allowance,
    //     balance = "0";

    // allowance = await tokenContract.allowance(address, addresses.ZAPIN_ADDRESS);
    // balance = await tokenContract.balanceOf(address);

    // const balanceVal = Number(balance) / Math.pow(10, token.decimals);

    // return {
    //     token: token.name,
    //     address: token.address,
    //     img: token.img,
    //     allowance: Number(allowance),
    //     balance: Number(balanceVal),
    // };
});

export interface IAccountSlice {
    bonds: { [key: string]: IUserBondDetails };
    balances: {
        wsBASH: string;
        sBASH: string;
        BASH: string;
        aBash: string;
    };
    loading: boolean;
    redeeming: {
        BASH: number;
        aBash: number;
    };
    staking: {
        BASH: number;
        sBASH: number;
    };
    wrapping: {
        sBASHAllowance: number;
    };
    tokens: { [key: string]: IUserTokenDetails };
}

const initialState: IAccountSlice = {
    loading: true,
    bonds: {},
    balances: { wsBASH: "", sBASH: "", BASH: "", aBash: "" },
    staking: { BASH: 0, sBASH: 0 },
    wrapping: { sBASHAllowance: 0 },
    redeeming: { BASH: 0, aBash: 0 },
    tokens: {},
};

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        fetchAccountSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAccountDetails.pending, state => {
                state.loading = true;
            })
            .addCase(loadAccountDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAccountDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(getBalances.pending, state => {
                state.loading = true;
            })
            .addCase(getBalances.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(getBalances.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(calculateUserBondDetails.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
                if (!action.payload) return;
                const bond = action.payload.bond;
                state.bonds[bond] = action.payload;
                state.loading = false;
            })
            .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(calculateUserTokenDetails.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(calculateUserTokenDetails.fulfilled, (state, action) => {
                if (!action.payload) return;
                const token = action.payload.token;
                state.tokens[token] = action.payload;
                state.loading = false;
            })
            .addCase(calculateUserTokenDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            });
    },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
