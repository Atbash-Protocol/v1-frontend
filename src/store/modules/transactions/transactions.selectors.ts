import { createSelector } from 'reselect';

import { IReduxState } from 'store/slices/state.interface';

import { TransactionTypeEnum } from './transactions.type';

export const selectPendingTransactions = (state: IReduxState) => state.transactions.filter(tx => tx.status === 'PENDING');

export const selectStakingPending = createSelector([selectPendingTransactions], transactions => {
    return transactions.some(({ type }) => type === TransactionTypeEnum.BASH_APPROVAL || type === TransactionTypeEnum.STAKE_PENDING);
});

export const selectUnStakingPending = createSelector([selectPendingTransactions], transactions => {
    return transactions.some(({ type }) => type === TransactionTypeEnum.SBASH_APPROVAL || type === TransactionTypeEnum.UNSTAKE_PENDING);
});
