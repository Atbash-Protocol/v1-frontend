import { createAsyncThunk } from '@reduxjs/toolkit';
import { constants, ethers, providers } from 'ethers';

import { metamaskErrorWrap } from 'helpers/networks/metamask-error-wrap';
import { IReduxState } from 'store/slices/state.interface';

import { loadBalancesAndAllowances } from '../account/account.thunks';
import { addPendingTransaction, clearPendingTransaction } from '../transactions/transactions.slice';
import { TransactionType, TransactionTypeEnum } from '../transactions/transactions.type';

export const approveWrapContract = createAsyncThunk('wrapping/approve', async ({ signer }: { signer: providers.Web3Provider }, { getState, dispatch }) => {
    const {
        main: {
            contracts: { SBASH_CONTRACT, WSBASH_CONTRACT },
        },
    } = getState() as IReduxState;

    if (!SBASH_CONTRACT || !WSBASH_CONTRACT) {
        throw new Error('Contract not set');
    }
    const gasPrice = await signer.getGasPrice();

    try {
        const approveTx = await SBASH_CONTRACT.approve(WSBASH_CONTRACT.address, constants.MaxUint256, { gasPrice });
        dispatch(addPendingTransaction({ type: TransactionTypeEnum.WRAPPING_APPROVAL, hash: approveTx.hash }));
        await approveTx.wait();
    } catch (err) {
        metamaskErrorWrap(err, dispatch);
    } finally {
        dispatch(clearPendingTransaction(TransactionTypeEnum.WRAPPING_APPROVAL));
    }

    const signerAddress = await signer.getSigner().getAddress();
    dispatch(loadBalancesAndAllowances(signerAddress));
});

export const wrapAction = createAsyncThunk(
    'wrapping/wrapping',
    async ({ signer, amount, type }: { signer: providers.Web3Provider; amount: number; type: TransactionType }, { getState, dispatch }) => {
        const {
            main: {
                contracts: { WSBASH_CONTRACT },
            },
        } = getState() as IReduxState;

        if (!WSBASH_CONTRACT) throw new Error('Unable to get WSBASH_CONTRACT');

        const gasPrice = await signer.getGasPrice();

        try {
            const transaction =
                type === TransactionTypeEnum.WRAPPING
                    ? await WSBASH_CONTRACT.wrap(ethers.utils.parseUnits(amount.toString(), 'gwei'), { gasPrice })
                    : await WSBASH_CONTRACT.unwrap(ethers.utils.parseEther(amount.toString()), { gasPrice });

            dispatch(addPendingTransaction({ type, hash: transaction.hash }));
        } catch (err) {
            console.log(err);
            return metamaskErrorWrap(err, dispatch);
        } finally {
            dispatch(clearPendingTransaction(type));
        }

        const signerAddress = await signer.getSigner().getAddress();
        dispatch(loadBalancesAndAllowances(signerAddress));
    },
);
