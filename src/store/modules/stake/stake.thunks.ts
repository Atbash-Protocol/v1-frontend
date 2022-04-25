// approve contract
import { Web3Provider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

import { success } from 'store/slices/messages-slice';
import { fetchPendingTxns } from 'store/slices/pending-txns-slice';
import { IReduxState } from 'store/slices/state.interface';

export const approveContract = createAsyncThunk(
    'stake/approve',
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
