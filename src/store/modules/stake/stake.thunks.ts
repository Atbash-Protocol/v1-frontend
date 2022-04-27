import { Web3Provider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

import { messages } from 'constants/messages';
import { metamaskErrorWrap } from 'helpers/networks/metamask-error-wrap';
import { success, info } from 'store/slices/messages-slice';
import { fetchPendingTxns, getStakingTypeText, clearPendingTxn, getPendingActionText } from 'store/slices/pending-txns-slice';
import { IReduxState } from 'store/slices/state.interface';

import { loadBalancesAndAllowances } from '../account/account.thunks';
import { ChangeStakeOptions } from './stake.types';

export const stakeAction = createAsyncThunk(
    'staking/staking',
    async ({ action, amount, signer, signerAddress }: ChangeStakeOptions & { signer: Web3Provider; signerAddress: string }, { dispatch, getState }) => {
        const {
            main: {
                contracts: { STAKING_HELPER_ADDRESS, STAKING_CONTRACT },
            },
        } = getState() as IReduxState;

        const gasPrice = await signer.getGasPrice();

        if (!STAKING_CONTRACT || !STAKING_HELPER_ADDRESS) throw new Error('Unable to get contracts');

        const transaction =
            action === 'STAKE'
                ? await STAKING_HELPER_ADDRESS.stake(ethers.utils.parseUnits(amount.toString(), 'gwei'), signerAddress, { gasPrice })
                : await STAKING_CONTRACT.unstake(ethers.utils.parseUnits(amount.toString(), 'gwei'), true, { gasPrice });

        try {
            dispatch(fetchPendingTxns({ txnHash: transaction.hash, text: getStakingTypeText(action), type: getPendingActionText(action) }));

            await transaction.wait();

            dispatch(success({ text: messages.tx_successfully_send }));
        } catch (err: unknown) {
            return metamaskErrorWrap(err, dispatch);
        } finally {
            if (transaction) {
                dispatch(clearPendingTxn(transaction.hash));
            }
        }

        dispatch(info({ text: messages.your_balance_update_soon }));

        await dispatch(loadBalancesAndAllowances(signerAddress));

        dispatch(info({ text: messages.your_balance_updated }));
    },
);

export const approveContract = createAsyncThunk(
    'staking/approve',
    async ({ signer, signerAddress, target }: { signer: Web3Provider; signerAddress: string; target: string }, { getState, dispatch }) => {
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
            const approveTx = await BASH_CONTRACT.approve(signerAddress, ethers.constants.MaxUint256, { gasPrice });
            dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text: 'Approving', type: 'approve_staking' }));
            await approveTx.wait();
            dispatch(success({ text: 'Success' }));
        } else if (target === 'SBASH_APPROVAL' && SBASH_CONTRACT) {
            const approveTx = await SBASH_CONTRACT.approve(signerAddress, ethers.constants.MaxUint256, { gasPrice });
            dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text: 'Approving', type: 'approve_staking' }));
            await approveTx.wait();
            dispatch(success({ text: 'Success' }));
        } else {
        }
    },
);
