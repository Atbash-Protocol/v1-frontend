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
            contracts: { BASH, SBASH_ADDRESS },
        },
    } = getState() as IReduxState;

    switch (target) {
        case "BASH":
    }

    if (!BASH) {
        throw new Error("Contract not set");
    }
    const gasPrice = await getGasPrice(provider);
    const connectedAddress = await provider.getSigner().getAddress();

    console.log(BASH);

    if (target === StakeTargetEnum.BASH && BASH) {
        const approveTx = await BASH.approve(connectedAddress, ethers.constants.MaxUint256, { gasPrice });
        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text: "Approving", type: "approve_staking" }));
        await approveTx.wait();
        dispatch(success({ text: "Success" }));
    }
});
