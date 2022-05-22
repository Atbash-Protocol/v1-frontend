import { createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

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
