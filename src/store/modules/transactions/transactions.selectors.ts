import _, { pick } from 'lodash';

import { IReduxState } from 'store/slices/state.interface';

import { TransactionType, TransactionTypeEnum } from './transactions.type';

export const selectPendingTx = (state: IReduxState, type: TransactionType): boolean => {
    const tx = state.transactions.find(t => t.type === type);

    return !tx ? false : true;
};

export const selectBASHStakingPending = (state: IReduxState) => state.transactions.length > 0;

export const selectStakingPending = ({ transactions }: IReduxState) => {
    const pendingTx = transactions.filter(
        tx =>
            tx.status === 'PENDING' &&
            [TransactionTypeEnum.BASH_APPROVAL, TransactionTypeEnum.SBASH_APPROVAL, TransactionTypeEnum.STAKING_PENDING].some(txType => txType === tx.type),
    );

    return pendingTx.length > 0;
};

export const selectPendingTransactions = (state: IReduxState) => state.transactions.filter(tx => tx.status === 'PENDING');
