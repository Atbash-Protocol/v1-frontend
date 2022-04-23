import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store/store";
import i18n from "../../i18n";
export interface IPendingTxn {
    readonly txnHash: string;
    readonly text: string;
    readonly type: string;
}

const initialState: Array<IPendingTxn> = [];

const pendingTxnsSlice = createSlice({
    name: "pendingTransactions",
    initialState,
    reducers: {
        fetchPendingTxns(state, action: PayloadAction<IPendingTxn>) {
            state.push(action.payload);
        },
        clearPendingTxn(state, action: PayloadAction<string>) {
            const target = state.find(x => x.txnHash === action.payload);
            if (target) {
                state.splice(state.indexOf(target), 1);
            }
        },
    },
});

export const getStakingTypeText = (action: string) => {
    return action.toLowerCase() === "stake" ? i18n.t("stake:StakingSB") : i18n.t("stake:UnstakingStakedSB");
};

export const getWrappingTypeText = (action: string) => {
    return action.toLowerCase() === "wrap" ? i18n.t("stake:WrappingsBASH") : i18n.t("stake:UnwrappingBASH");
};

export const isPendingTxn = (pendingTransactions: IPendingTxn[], type: string) => {
    return pendingTransactions.map(x => x.type).includes(type);
};

export const txnButtonText = (pendingTransactions: IPendingTxn[], type: string, defaultText: string) => {
    return isPendingTxn(pendingTransactions, type) ? i18n.t("PendingEllipsis") : defaultText;
};

export const getPendingActionText = (action: string) => (action === "stake" ? i18n.t("stake:Staking") : i18n.t("stake:Unstaking"));

export const selectIsStakingPendingTx = (state: RootState): boolean => state.pendingTransactions.find(tx => tx.type === "staking") !== undefined;

export const selectIsPendingTransactionType = (state: RootState, type: TransactionTypeEnum): boolean => state.pendingTransactions.find(tx => tx.type === "staking") !== undefined;

export const { fetchPendingTxns, clearPendingTxn } = pendingTxnsSlice.actions;

export default pendingTxnsSlice.reducer;

// interfaces to add

export type TransactionTypeEnum = {
    APPROVE_CONTRACT: "APPROVE_CONTRACT";
    STAKING_APPROVAL: "STAKING_APPROVAL";
    STAKING_PENDING: "STAKING_PENDING";
};
