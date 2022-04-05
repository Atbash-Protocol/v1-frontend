// approve contract

import { JsonRpcProvider } from "@ethersproject/providers";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { TimeTokenContract } from "abi";
import { Contract, ethers } from "ethers";
import { getGasPrice } from "helpers/get-gas-price";
import { success } from "store/slices/messages-slice";
import { fetchPendingTxns } from "store/slices/pending-txns-slice";
import { IReduxState } from "store/slices/state.interface";
import { StakeTargetEnum } from "./stake.types";

export const approveContract = createAsyncThunk("stake/approve", async ({ provider, target }: { provider: JsonRpcProvider; target: string }, { getState, dispatch }) => {
    const {
        main: {
            contracts: { BASH_CONTRACT, SBASH_CONTRACT },
        },
    } = getState() as IReduxState;

    switch (target) {
        case "BASH_CONTRACT":
    }

    if (!BASH_CONTRACT) {
        throw new Error("Contract not set");
    }
    const gasPrice = await getGasPrice(provider);
    const connectedAddress = await provider.getSigner().getAddress();

    console.log(BASH_CONTRACT);

    if (target === StakeTargetEnum.BASH && BASH_CONTRACT) {
        const approveTx = await BASH_CONTRACT.approve(connectedAddress, ethers.constants.MaxUint256, { gasPrice });
        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text: "Approving", type: "approve_staking" }));
        await approveTx.wait();
        dispatch(success({ text: "Success" }));
    }
});
