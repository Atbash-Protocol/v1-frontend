import { createAsyncThunk } from '@reduxjs/toolkit';
import { constants } from 'ethers';
import { providers } from 'web3modal';

import { metamaskErrorWrap } from 'helpers/networks/metamask-error-wrap';
import { IReduxState } from 'store/slices/state.interface';

import { loadBalancesAndAllowances } from '../account/account.thunks';
import { addPendingTransaction, clearPendingTransaction } from '../transactions/transactions.slice';
import { TransactionType } from '../transactions/transactions.type';

export const approveContract = createAsyncThunk(
    'wrapping/approve',
    async ({ signer, signerAddress, transactionType }: { signer: providers.Web3Provider; signerAddress: string; transactionType: TransactionType }, { getState, dispatch }) => {
        const {
            main: {
                contracts: { SBASH_CONTRACT },
            },
        } = getState() as IReduxState;

        if (!SBASH_CONTRACT) {
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
