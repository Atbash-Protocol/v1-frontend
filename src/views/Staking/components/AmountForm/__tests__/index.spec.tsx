import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { Web3Context } from 'contexts/web3/web3.context';
import { TransactionTypeEnum } from 'store/modules/transactions/transactions.type';

import AmountForm from '..';

const renderComponent = (props: any, state: any) => {
    const mockStore = createMockStore([thunk]);
    const store = mockStore(state);
    const providerValue = { state: { signer: 'signer', signerAddress: 'signerAddress', networkID: 2 } };

    const component = render(
        <Web3Context.Provider value={providerValue as any}>
            <Provider store={store}>
                <AmountForm {...props} />
            </Provider>
        </Web3Context.Provider>,
    );

    return {
        component,
        store,
    };
};

describe('#AmountForm', () => {
    const props = {
        initialValue: 0,
        maxValue: 10,
        transactionType: TransactionTypeEnum.APPROVE_CONTRACT,
        approvesNeeded: true,
        onApprove: jest.fn(),
        onAction: jest.fn(),
        approveLabel: 'approveLabel',
        actionLabel: 'actionLabel',
        isLoading: false,
    };
    const state = { transactions: [] };

    it('renders with loading', () => {
        const {
            component: { container },
        } = renderComponent({ ...props, isLoading: true }, state);

        expect(container.querySelectorAll('.MuiCircularProgress-root').length).not.toBe(0);
    });

    it('sets the maximum', async () => {
        const comp = renderComponent(props, state);

        const setMaxBtn = await screen.findByText(/Max/i);
        fireEvent.click(setMaxBtn);

        const input = await comp.component.container.querySelector('input');

        expect(input?.value).toEqual(props.maxValue.toString());
    });

    describe('regarding actions', () => {
        it('does not trigger event if transaction is pending', async () => {
            renderComponent(props, { transactions: [{ type: TransactionTypeEnum.APPROVE_CONTRACT, hash: '0x', status: 'PENDING' }] });

            const actionBtn = await screen.findByText(/approveLabel/i);
            fireEvent.click(actionBtn);

            expect(props.onAction).not.toHaveBeenCalled();
            expect(props.onApprove).not.toHaveBeenCalled();
        });

        it('handles the approval', async () => {
            renderComponent(props, state);

            const actionBtn = await screen.findByText(/approveLabel/i);
            fireEvent.click(actionBtn);

            expect(props.onApprove).toHaveBeenCalledWith(props.transactionType);
        });

        it('diespatches event if value is above 0', async () => {
            const { component, store } = renderComponent({ ...props, approvesNeeded: false }, state);

            const input = await component.container.querySelector('input');
            fireEvent.change(input!, { target: { value: '0' } });

            const actionBtn = await screen.findByText(/actionLabel/i);
            fireEvent.click(actionBtn);

            expect(store.getActions()).toHaveLength(1);
            expect(store.getActions()[0]).toEqual(
                expect.objectContaining({ payload: { description: 'Please provide an amount', severity: 'warning' }, type: 'messages/addNotification' }),
            );
            expect(props.onAction).not.toHaveBeenCalled();
        });

        it('calls the action', async () => {
            renderComponent({ ...props, approvesNeeded: false }, state);

            const setMaxBtn = await screen.findByText(/Max/i);
            fireEvent.click(setMaxBtn);
            const actionBtn = await screen.findByText(/actionLabel/i);
            fireEvent.click(actionBtn);

            expect(props.onAction).toHaveBeenCalledWith(props.maxValue.toString());
        });
    });
});
