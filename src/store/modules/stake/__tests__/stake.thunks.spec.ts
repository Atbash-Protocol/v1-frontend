import { BigNumber } from 'ethers';

import * as MetamaskErrorModule from 'helpers/networks/metamask-error-wrap';
import * as AccountThunkModule from 'store/modules/account/account.thunks';
import { ContractEnum } from 'store/modules/app/app.types';
import * as MessagesModule from 'store/modules/messages/messages.slice';
import * as TransactionModule from 'store/modules/transactions/transactions.slice';
import { TransactionTypeEnum } from 'store/modules/transactions/transactions.type';

import { approveContract, stakeAction } from '../stake.thunks';

describe('#StakeAction', () => {
    let signer = {};

    beforeAll(() => {
        signer = {
            getGasPrice: jest.fn().mockResolvedValue(BigNumber.from(1000)),
        };
    });

    it('throws an error if contracts are not ready', async () => {
        const dispatch = jest.fn();
        const payload = { signer, signerAddress: '0xAddress' };
        const getState = jest.fn(() => ({
            main: {
                contracts: {
                    [ContractEnum.STAKING_HELPER_CONTRACT]: null,
                    [ContractEnum.STAKING_CONTRACT]: null,
                },
            },
        }));
        const action = stakeAction(payload as any);
        const res = await action(dispatch, getState, undefined);

        expect((res as any).error.message).toEqual('Unable to get contracts');
    });

    describe('Regarding actions', () => {
        let state = {};

        beforeEach(() => {
            state = {
                main: {
                    contracts: {
                        STAKING_HELPER_CONTRACT: {
                            stake: jest.fn().mockResolvedValue({
                                hash: '0xStakeHash',
                                wait: jest.fn().mockResolvedValue({}),
                            }),
                        },
                        STAKING_CONTRACT: {
                            unstake: jest.fn().mockResolvedValue({
                                hash: '0xUnstakeHash',
                                wait: jest.fn().mockResolvedValue({}),
                            }),
                        },
                    },
                },
            };
        });

        it('stakes', async () => {
            const pendingTxSpy = jest.spyOn(TransactionModule, 'addPendingTransaction');
            const notificationSpy = jest.spyOn(MessagesModule, 'addNotification');
            const clearPendingTxSpy = jest.spyOn(TransactionModule, 'clearPendingTransaction');
            const loadBalancesAndAllowancesSpy = jest.spyOn(AccountThunkModule, 'loadBalancesAndAllowances');

            const dispatch = jest.fn();
            const payload = { signer, signerAddress: '0xAddress', amount: 10, action: 'STAKE' };
            const action = stakeAction(payload as any);

            const { type } = await action(dispatch, () => state, undefined);

            expect(type).toEqual('staking/staking/fulfilled');
            expect(pendingTxSpy).toHaveBeenCalledWith({ type: TransactionTypeEnum.STAKE_PENDING, hash: '0xStakeHash' });
            expect(notificationSpy).toHaveBeenNthCalledWith(1, { description: 'Your transaction was successfully sent', severity: 'success' });
            expect(notificationSpy).toHaveBeenNthCalledWith(2, { description: 'Your balance will update soon', severity: 'info' });
            expect(notificationSpy).toHaveBeenNthCalledWith(3, { description: 'Your balance was successfully updated', severity: 'info' });
            expect(clearPendingTxSpy).toHaveBeenCalledWith(TransactionTypeEnum.STAKE_PENDING);
            expect(loadBalancesAndAllowancesSpy).toHaveBeenCalled();
        });

        it('unstakes', async () => {
            const dispatch = jest.fn();
            const payload = { signer, signerAddress: '0xAddress', amount: 10, action: 'UNSTAKE' };
            const action = stakeAction(payload as any);

            const { type } = await action(dispatch, () => state, undefined);
            expect(type).toEqual('staking/staking/fulfilled');
        });

        it('catches the error', async () => {
            const metamaskErrorSpy = jest.spyOn(MetamaskErrorModule, 'metamaskErrorWrap');
            state = {
                ...state,
                main: {
                    contracts: {
                        ...(state as any).main.contracts,
                        STAKING_HELPER_CONTRACT: {
                            stake: jest.fn().mockRejectedValue({
                                hash: '0xStakeHash',
                                wait: jest.fn().mockResolvedValue({}),
                            }),
                        },
                    },
                },
            };

            const dispatch = jest.fn();
            const payload = { signer, signerAddress: '0xAddress', amount: 10, action: 'STAKE' };
            const action = stakeAction(payload as any);

            const { type } = await action(dispatch, () => state, undefined);
            expect(type).toEqual('staking/staking/fulfilled');
            expect(metamaskErrorSpy).toHaveBeenCalled();
        });
    });
});

describe('#approveContrat', () => {
    it('throws if no contract is set', async () => {
        const signer = {
            getGasPrice: jest.fn().mockResolvedValue(BigNumber.from(10)),
        };
        const dispatch = jest.fn();
        const payload = { signer, signerAddress: '0xAddress', transactionType: TransactionTypeEnum.BASH_APPROVAL };
        const getState = jest.fn(() => ({
            main: {
                contracts: {
                    BASH_CONTRACT: null,
                    SBASH_CONTRACT: null,
                },
            },
        }));
        const action = approveContract(payload as any);
        const res = await action(dispatch, getState, undefined);

        expect((res as any).error.message).toEqual('Contract not set');
        expect(res.type).toEqual('staking/approve/rejected');
    });

    it('approves the contract', async () => {
        const signer = {
            getGasPrice: jest.fn().mockResolvedValue(BigNumber.from(10)),
        };
        const dispatch = jest.fn();
        const payload = { signer, signerAddress: '0xAddress', transactionType: TransactionTypeEnum.BASH_APPROVAL };
        const getState = jest.fn(() => ({
            main: {
                contracts: {
                    BASH_CONTRACT: {
                        approve: jest.fn().mockResolvedValue({
                            wait: jest.fn().mockResolvedValue({}),
                            hash: '0xApproveBashHash',
                        }),
                    },
                    SBASH_CONTRACT: {
                        approve: jest.fn().mockResolvedValue({
                            wait: jest.fn().mockResolvedValue({}),
                            hash: '0xApproveSBashHash',
                        }),
                    },
                },
            },
        }));
        const pendingTxSpy = jest.spyOn(TransactionModule, 'addPendingTransaction');
        const clearPendingTxSpy = jest.spyOn(TransactionModule, 'clearPendingTransaction');
        const loadBalancesAndAllowancesSpy = jest.spyOn(AccountThunkModule, 'loadBalancesAndAllowances');

        const action = approveContract(payload as any);
        const res = await action(dispatch, getState, undefined);

        expect(res.type).toEqual('staking/approve/fulfilled');
        expect(pendingTxSpy).toHaveBeenCalledWith({ type: TransactionTypeEnum.BASH_APPROVAL, hash: '0xApproveBashHash' });
        expect(clearPendingTxSpy).toHaveBeenCalledWith(TransactionTypeEnum.BASH_APPROVAL);
        expect(loadBalancesAndAllowancesSpy).toHaveBeenCalled();
    });

    it('catchs the metamask error', async () => {
        const signer = {
            getGasPrice: jest.fn().mockResolvedValue(BigNumber.from(10)),
        };
        const dispatch = jest.fn();
        const metamaskErrorSpy = jest.spyOn(MetamaskErrorModule, 'metamaskErrorWrap');

        const payload = { signer, signerAddress: '0xAddress', transactionType: TransactionTypeEnum.BASH_APPROVAL };
        const getState = jest.fn(() => ({
            main: {
                contracts: {
                    BASH_CONTRACT: {
                        approve: jest.fn().mockRejectedValue({
                            wait: jest.fn().mockRejectedValue({}),
                            hash: '0xApproveBashHash',
                        }),
                    },
                    SBASH_CONTRACT: {
                        approve: jest.fn().mockResolvedValue({
                            wait: jest.fn().mockResolvedValue({}),
                            hash: '0xApproveSBashHash',
                        }),
                    },
                },
            },
        }));
        const action = approveContract(payload as any);

        const { type } = await action(dispatch, getState, undefined);
        expect(type).toEqual('staking/approve/fulfilled');
        expect(metamaskErrorSpy).toHaveBeenCalled();
    });
});
