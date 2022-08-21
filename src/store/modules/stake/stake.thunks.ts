import { createAsyncThunk } from '@reduxjs/toolkit';
import { constants, utils, providers } from 'ethers';

import { messages } from 'constants/messages';
import { metamaskErrorWrap } from 'helpers/networks/metamask-error-wrap';
import { addNotification } from 'store/modules/messages/messages.slice';
// import { fetchPendingTxns, getStakingTypeText, clearPendingTxn, getPendingActionText } from 'store/slices/pending-txns-slice';
import { IReduxState } from 'store/slices/state.interface';

import { loadBalancesAndAllowances } from '../account/account.thunks';
import { addPendingTransaction, clearPendingTransaction } from '../transactions/transactions.slice';
import { TransactionType, TransactionTypeEnum } from '../transactions/transactions.type';
import { ChangeStakeOptions } from './stake.types';

export const stakeAction = createAsyncThunk(
    'staking/staking',
    async ({ action, amount, signer, signerAddress }: ChangeStakeOptions & { signer: providers.Web3Provider; signerAddress: string }, { dispatch, getState }) => {
        const {
            main: {
                contracts: { STAKING_HELPER_CONTRACT, STAKING_CONTRACT },
            },
        } = getState() as IReduxState;

        const gasPrice = await signer.getGasPrice();

        if (!STAKING_CONTRACT || !STAKING_HELPER_CONTRACT) throw new Error('Unable to get contracts');
        let transaction = undefined;

        try {
            transaction =
                action === 'STAKE'
                    ? await STAKING_HELPER_CONTRACT.stake(utils.parseUnits(amount.toString(), 'gwei'), signerAddress, { gasPrice })
                    : await STAKING_CONTRACT.unstake(utils.parseUnits(amount.toString(), 'gwei'), true, { gasPrice });

            dispatch(addPendingTransaction({ type: TransactionTypeEnum.STAKE_PENDING, hash: transaction.hash }));

            await transaction.wait();

            dispatch(addNotification({ severity: 'success', description: messages.tx_successfully_send }));
        } catch (err: unknown) {
            metamaskErrorWrap(err, dispatch);
        } finally {
            dispatch(clearPendingTransaction(TransactionTypeEnum.STAKE_PENDING));
        }

        dispatch(addNotification({ severity: 'info', description: messages.your_balance_update_soon }));

        dispatch(loadBalancesAndAllowances(signerAddress));

        dispatch(addNotification({ severity: 'info', description: messages.your_balance_updated }));
    },
);

export const approveContract = createAsyncThunk(
    'staking/approve',
    async ({ signer, signerAddress, transactionType }: { signer: providers.Web3Provider; signerAddress: string; transactionType: TransactionType }, { getState, dispatch }) => {
        const {
            main: {
                contracts: { BASH_CONTRACT, SBASH_CONTRACT },
            },
        } = getState() as IReduxState;

        if (!BASH_CONTRACT || !SBASH_CONTRACT) {
            throw new Error('Contract not set');
        }
        const gasPrice = await signer.getGasPrice();

        try {
            const targetContract = transactionType === 'BASH_APPROVAL' ? BASH_CONTRACT : SBASH_CONTRACT;

            const approveTx = await targetContract.approve(signerAddress, constants.MaxUint256, { gasPrice });
            dispatch(addPendingTransaction({ type: transactionType, hash: approveTx.hash }));
            await approveTx.wait();
        } catch (err) {
            metamaskErrorWrap(err, dispatch);
        } finally {
            dispatch(clearPendingTransaction(transactionType));
        }

        dispatch(loadBalancesAndAllowances(signerAddress));
    },
);
