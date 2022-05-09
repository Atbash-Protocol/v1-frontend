import { createAsyncThunk } from '@reduxjs/toolkit';
import { constants, utils, providers } from 'ethers';

import { messages } from 'constants/messages';
import { metamaskErrorWrap } from 'helpers/networks/metamask-error-wrap';
import { addNotification } from 'store/modules/messages/messages.slice';
// import { fetchPendingTxns, getStakingTypeText, clearPendingTxn, getPendingActionText } from 'store/slices/pending-txns-slice';
import { IReduxState } from 'store/slices/state.interface';

import { loadBalancesAndAllowances } from '../account/account.thunks';
import { addPendingTransaction, clearPendingTransaction } from '../transactions/transactions.slice';
import { TransactionTypeEnum } from '../transactions/transactions.type';
import { ChangeStakeOptions } from './stake.types';

export const stakeAction = createAsyncThunk(
    'staking/staking',
    async ({ action, amount, signer, signerAddress }: ChangeStakeOptions & { signer: providers.Web3Provider; signerAddress: string }, { dispatch, getState }) => {
        const {
            main: {
                contracts: { STAKING_HELPER_ADDRESS, STAKING_CONTRACT },
            },
        } = getState() as IReduxState;

        const gasPrice = await signer.getGasPrice();

        if (!STAKING_CONTRACT || !STAKING_HELPER_ADDRESS) throw new Error('Unable to get contracts');

        const transaction =
            action === 'STAKE'
                ? await STAKING_HELPER_ADDRESS.stake(utils.parseUnits(amount.toString(), 'gwei'), signerAddress, { gasPrice })
                : await STAKING_CONTRACT.unstake(utils.parseUnits(amount.toString(), 'gwei'), true, { gasPrice });

        try {
            dispatch(addPendingTransaction({ type: TransactionTypeEnum.STAKING_PENDING, hash: transaction.hash }));

            await transaction.wait();

            dispatch(addNotification({ severity: 'success', description: messages.tx_successfully_send }));
        } catch (err: unknown) {
            return metamaskErrorWrap(err, dispatch);
        } finally {
            if (transaction) {
                dispatch(clearPendingTransaction(TransactionTypeEnum.STAKING_PENDING));
            }
        }

        dispatch(addNotification({ severity: 'info', description: messages.your_balance_update_soon }));

        await dispatch(loadBalancesAndAllowances(signerAddress));

        dispatch(addNotification({ severity: 'info', description: messages.your_balance_updated }));
    },
);

export const approveContract = createAsyncThunk(
    'staking/approve',
    async ({ signer, signerAddress, target }: { signer: providers.Web3Provider; signerAddress: string; target: string }, { getState, dispatch }) => {
        const {
            main: {
                contracts: { BASH_CONTRACT, SBASH_CONTRACT },
            },
        } = getState() as IReduxState;

        if (!BASH_CONTRACT) {
            throw new Error('Contract not set');
        }
        const gasPrice = await signer.getGasPrice();

        if (target === 'BASH_APPROVAL' && BASH_CONTRACT) {
            const approveTx = await BASH_CONTRACT.approve(signerAddress, constants.MaxUint256, { gasPrice });
            dispatch(addPendingTransaction({ type: TransactionTypeEnum.BASH_APPROVAL, hash: approveTx.hash }));
            await approveTx.wait();
            dispatch(addNotification({ severity: 'success', description: messages.tx_successfully_send }));
        } else if (target === 'SBASH_APPROVAL' && SBASH_CONTRACT) {
            const approveTx = await SBASH_CONTRACT.approve(signerAddress, constants.MaxUint256, { gasPrice });
            dispatch(addPendingTransaction({ type: TransactionTypeEnum.SBASH_APPROVAL, hash: approveTx.hash }));
            await approveTx.wait();
            dispatch(addNotification({ severity: 'success', description: messages.tx_successfully_send }));
        } else {
        }
    },
);
