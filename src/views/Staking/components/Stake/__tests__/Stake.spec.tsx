import { render, screen, fireEvent } from '@testing-library/react';
import Decimal from 'decimal.js';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { Web3Context } from 'contexts/web3/web3.context';
import * as AccountSelectorModule from 'store/modules/account/account.selectors';
import * as TransactionSelectorModule from 'store/modules/transactions/transactions.selectors';

import Stake from '../index';

jest.mock('../../AmountForm', () => ({ onApprove, onAction, approveLabel, actionLabel }: any) => {
    return (
        <div>
            <button onClick={() => onApprove(approveLabel)}>{`mockAction-${approveLabel}`}</button>
            <button onClick={() => onAction(10)}>{`mockAction-${actionLabel}`}</button>
        </div>
    );
});

const renderComponent = (state: any) => {
    const mockStore = createMockStore([thunk]);
    const store = mockStore(state);
    const providerValue = { state: { signer: 'signer', signerAddress: 'signerAddress', networkID: 2 } };

    const component = render(
        <Web3Context.Provider value={providerValue as any}>
            <Provider store={store}>
                <Stake />
            </Provider>
        </Web3Context.Provider>,
    );

    return {
        component,
        store,
    };
};

describe('Stake', () => {
    beforeEach(() => {
        jest.spyOn(AccountSelectorModule, 'selectBASHBalance').mockReturnValue(new Decimal(10.01));
        jest.spyOn(AccountSelectorModule, 'selectSBASHBalance').mockReturnValue(new Decimal(10));
        jest.spyOn(AccountSelectorModule, 'selectUserStakingAllowance').mockReturnValue({
            BASHAllowanceNeeded: false,
            SBASHAllowanceNeeded: false,
        });
        jest.spyOn(TransactionSelectorModule, 'selectStakingPending').mockReturnValue(false);
    });

    it('handles approves correctly', async () => {
        const { store } = renderComponent({});

        const approve = await screen.findByText(/stake:ApproveStaking/i);

        fireEvent.click(approve);

        expect(store.getActions()[0]).toEqual(
            expect.objectContaining({
                type: 'staking/approve/pending',
                meta: expect.objectContaining({
                    arg: { signer: 'signer', signerAddress: 'signerAddress', transactionType: 'stake:ApproveStaking' },
                }),
            }),
        );
    });

    it('dispatches stake', async () => {
        const { store } = renderComponent({});

        const stake = await screen.getAllByText(/mockAction-stake:Stake/i);
        fireEvent.click(stake[0]);

        expect(store.getActions()[0]).toEqual(
            expect.objectContaining({
                type: 'staking/staking/pending',
                meta: expect.objectContaining({
                    arg: { action: 'STAKE', amount: 10, signer: 'signer', signerAddress: 'signerAddress' },
                }),
            }),
        );
    });

    it('dispatches unstake', async () => {
        const { store } = renderComponent({});

        const stake = await screen.getAllByText(/mockAction-stake:Unstake/i);

        fireEvent.click(stake[0]);

        expect(store.getActions()[0]).toEqual(
            expect.objectContaining({
                type: 'staking/staking/pending',
                meta: expect.objectContaining({
                    arg: { action: 'UNSTAKE', amount: 10, signer: 'signer', signerAddress: 'signerAddress' },
                }),
            }),
        );
    });

    it('handles tab change', async () => {
        renderComponent({});

        const stake = await screen.getAllByText(/stake:Unstake/i);
        fireEvent.click(stake[0]);
        const tabElement = await screen.getByText('stake:Unstake');

        expect(tabElement).toBeDefined();
        expect(tabElement.className).toContain('Mui-selected');
    });
});
