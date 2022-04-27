import { useContext } from 'react';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { BigNumber, Contract, ethers } from 'ethers';

import { Web3Context } from 'contexts/web3/web3.context';
import { metamaskErrorWrap } from 'helpers/networks/metamask-error-wrap';
import { successTransaction, walletConnectWarning } from 'store/slices/messages-slice';
import { clearPendingTxn, fetchPendingTxns } from 'store/slices/pending-txns-slice';
import { IReduxState } from 'store/slices/state.interface';

import { AccountSlice } from './account.types';

export const loadBalancesAndAllowances = createAsyncThunk(
    'account/loadBalancesAndAllowances',
    async (address: string, { getState }): Promise<Pick<AccountSlice, 'balances' | 'stakingAllowance'>> => {
        if (!address) throw new Error('Missing address');

        let BASHbalance = ethers.BigNumber.from(0);
        let sBASHBalance = ethers.BigNumber.from(0);
        const wsBASHBalance = ethers.BigNumber.from(0);
        let stakeAllowance = ethers.BigNumber.from(0);
        let unstakeAllowance = ethers.BigNumber.from(0);
        // const wrapAllowance = ethers.BigNumber.from(0);

        const {
            main: {
                contracts: { BASH_CONTRACT, SBASH_CONTRACT, STAKING_CONTRACT, STAKING_HELPER_ADDRESS },
            },
        } = getState() as IReduxState;

        if (BASH_CONTRACT && STAKING_HELPER_ADDRESS) {
            BASHbalance = await BASH_CONTRACT.balanceOf(address);

            stakeAllowance = await BASH_CONTRACT.allowance(address, STAKING_HELPER_ADDRESS.address);
            // disable: redeemAllowance = await sbContract.allowance(address, addresses.REDEEM_ADDRESS);
        }

        if (SBASH_CONTRACT && STAKING_CONTRACT) {
            unstakeAllowance = await SBASH_CONTRACT.allowance(address, STAKING_CONTRACT.address);
            sBASHBalance = await SBASH_CONTRACT.balanceOf(address);
        }

        return {
            balances: {
                WSBASH: wsBASHBalance,
                SBASH: sBASHBalance,
                BASH: BASHbalance,
            },

            stakingAllowance: {
                BASH: stakeAllowance,
                SBASH: unstakeAllowance,
            },
        };
    },
);

export const approveContract = createAsyncThunk(
    'account/approveContract',
    async ({ contract, amount, type }: { contract: Contract; type: string; amount?: BigNumber }, { dispatch }) => {
        const {
            state: { signer, signerAddress },
        } = useContext(Web3Context);

        if (!signerAddress || !signer) throw new Error('Unable to get signerAddress');

        let approveTx;
        try {
            const gasPrice = await signer.getGasPrice();

            approveTx = await contract.approve(signerAddress, amount ?? ethers.constants.MaxUint256, { gasPrice });

            // const pendingTxnType = token === "BASH" ? "approve_staking" : "approve_unstaking";
            const text = 'some text';

            dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type }));
            await approveTx.wait();
            dispatch(successTransaction);
        } catch (err: unknown) {
            return metamaskErrorWrap(err, dispatch);
        } finally {
            if (approveTx) {
                dispatch(clearPendingTxn(approveTx.hash));
            }
        }
    },
);
