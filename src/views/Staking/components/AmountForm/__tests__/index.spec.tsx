import { configureStore } from '@reduxjs/toolkit';

import { TransactionTypeEnum } from 'store/modules/transactions/transactions.type';
import { renderComponent } from 'tests/utils';

import AmountForm from '..';

describe('#AmountForm', () => {
    it('renders', () => {
        const props = {
            initialValue: 0,
            maxValue: 10,
            transactionType: TransactionTypeEnum.APPROVE_CONTRACT,
            approvesNeeded: true,
            onApprove: jest.fn(),
            onAction: jest.fn(),
            approveLabel: 'approveLabel',
            actionLabel: 'actionLabel',
            isLoading: true,
        };
        const comp = renderComponent({
            component: <AmountForm {...props} />,
            store: configureStore({
                reducer: {},
            }),
            context: {},
        });

        expect(comp).toMatchSnapshot();
    });
});
