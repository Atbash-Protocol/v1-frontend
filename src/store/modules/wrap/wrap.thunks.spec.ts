import { BigNumber, constants } from 'ethers';

import * as MetamaskErrorModule from 'helpers/networks/metamask-error-wrap';

import { ContractEnum } from '../app/app.types';
import { TransactionTypeEnum } from '../transactions/transactions.type';
import { approveWrapContract, wrapAction } from './wrap.thunks';

describe('#approveWrapContract', () => {
    it.each([
        { WSBASH_CONTRACT: null, SBASH_CONTRACT: null },
        { BASH_CONTRACT: jest.fn(), SBASH_CONTRACT: null },
        { WSBASH_CONTRACT: null, SBASH_CONTRACT: jest.fn() },
    ])('throws an error if contracts are not set', async ({ SBASH_CONTRACT, WSBASH_CONTRACT }) => {
        const signer = jest.fn();
        const getState = jest.fn(() => ({
            main: {
                contracts: {
                    [ContractEnum.SBASH_CONTRACT]: SBASH_CONTRACT,
                    [ContractEnum.WSBASH_CONTRACT]: WSBASH_CONTRACT,
                },
            },
        }));
        const dispatch = jest.fn();

        const action = approveWrapContract({ signer } as any);
        const res = await action(dispatch, getState, undefined);

        expect((res as any).error.message).toEqual('Contract not set');
    });

    describe('When the contracts are set', () => {
        const WSBASH_CONTRACT = { address: '0xWashBashContract' };
        let signer: any;
        let approveMock;
        let SBASH_CONTRACT: any;
        let getState: any;
        let dispatch: any;

        beforeEach(() => {
            signer = {
                getGasPrice: jest.fn().mockResolvedValue(BigNumber.from('0x1')),
                getSigner: () => ({
                    getAddress: () => '0xSignerAddress',
                }),
            };
            approveMock = jest.fn().mockResolvedValue({
                wait: jest.fn().mockResolvedValue(undefined),
            });
            SBASH_CONTRACT = {
                approve: approveMock,
            };
            getState = jest.fn(() => ({
                main: {
                    contracts: {
                        [ContractEnum.SBASH_CONTRACT]: SBASH_CONTRACT,
                        [ContractEnum.WSBASH_CONTRACT]: WSBASH_CONTRACT,
                    },
                },
            }));
            dispatch = jest.fn();
        });

        it('creates an approve transaction', async () => {
            const action = approveWrapContract({ signer } as any);
            await action(dispatch, getState, undefined);

            expect(SBASH_CONTRACT.approve).toHaveBeenCalledWith(WSBASH_CONTRACT.address, constants.MaxUint256, { gasPrice: BigNumber.from('0x1') });
            expect(dispatch).toHaveBeenNthCalledWith(
                1,
                expect.objectContaining({
                    type: 'wrapping/approve/pending',
                }),
            );
        });

        it('adds notification', async () => {
            const action = approveWrapContract({ signer } as any);
            await action(dispatch, getState, undefined);

            expect(dispatch).toHaveBeenNthCalledWith(
                2,
                expect.objectContaining({
                    type: 'pendingTransactions/addPendingTransaction',
                }),
            );
        });

        it('clears transactions', async () => {
            const action = approveWrapContract({ signer } as any);
            await action(dispatch, getState, undefined);

            expect(dispatch).toHaveBeenNthCalledWith(
                3,
                expect.objectContaining({
                    type: 'pendingTransactions/clearPendingTransaction',
                }),
            );
        });

        it('handles error', async () => {
            SBASH_CONTRACT.approve = jest.fn().mockRejectedValue(new Error('err'));
            const spy = jest.spyOn(MetamaskErrorModule, 'metamaskErrorWrap');
            const action = approveWrapContract({ signer } as any);
            await action(dispatch, getState, undefined);

            expect(spy).toHaveBeenCalled();
        });
    });
});

describe('#changeWrap', () => {
    it('throws an error if WSBASH contract does not exists', async () => {
        const getState = jest.fn(() => ({
            main: { contracts: { WSBASH_CONTRACT: null } },
        }));
        const action = wrapAction({ signer: jest.fn(), type: '' } as any);
        const res = await action(jest.fn(), getState, undefined);

        expect((res as any).error.message).toEqual('Unable to get WSBASH_CONTRACT');
    });

    describe('when contracts are defined', () => {
        let txResultMock: any;
        let WSBASH_CONTRACT: any;
        let getState: any;
        let dispatch: any;
        let signer: any;
        let action: any;

        beforeEach(() => {
            txResultMock = { wait: jest.fn().mockResolvedValue({}) };

            WSBASH_CONTRACT = {
                wrap: jest.fn().mockResolvedValue(txResultMock),
                unwrap: jest.fn().mockResolvedValue(txResultMock),
            };
            dispatch = jest.fn();
            getState = jest.fn(() => ({
                main: { contracts: { WSBASH_CONTRACT } },
            }));
            signer = {
                getSigner: jest.fn(() => ({ getAddress: jest.fn().mockResolvedValue('0xSigner') })),
                getGasPrice: jest.fn().mockResolvedValue(BigNumber.from('0x1')),
            };
        });

        it('Wraps on wrap action', async () => {
            const amount = 10;
            action = wrapAction({ signer, type: TransactionTypeEnum.WRAPPING, amount } as any);
            await action(dispatch, getState, undefined);

            expect(WSBASH_CONTRACT.wrap).toHaveBeenCalledWith(BigNumber.from(amount * 10 ** 9), { gasPrice: BigNumber.from('0x1') });
        });

        it('UnWraps on unwrap action', async () => {
            const amount = 10;
            action = wrapAction({ signer, type: TransactionTypeEnum.UNWRAPPING, amount } as any);
            await action(dispatch, getState, undefined);

            expect(WSBASH_CONTRACT.unwrap).toHaveBeenCalledWith(expect.any(BigNumber), { gasPrice: BigNumber.from('0x1') });
        });
    });
});
