import { createSelector } from 'reselect';

import { IReduxState } from 'store/slices/state.interface';

import { TransactionType, TransactionTypeEnum } from './transactions.type';

export const selectPendingTransactions = (state: IReduxState) => state.transactions.filter(tx => tx.status === 'PENDING');

export const selectPendingTx = (state: IReduxState, type: TransactionType): boolean => {
    const tx = state.transactions.find(t => t.type === type);

    return !tx ? false : true;
};

export const selectStakingPending = createSelector([selectPendingTransactions], transactions => {
    return transactions.some(({ type }) => type === TransactionTypeEnum.BASH_APPROVAL || type === TransactionTypeEnum.STAKE_PENDING);
});

export const selectUnStakingPending = createSelector([selectPendingTransactions], transactions => {
    return transactions.some(({ type }) => type === TransactionTypeEnum.SBASH_APPROVAL || type === TransactionTypeEnum.UNSTAKE_PENDING);
});
