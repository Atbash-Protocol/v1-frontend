import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as AccountSelectorModule from 'store/modules/account/account.selectors';
import * as StakeSelectorModule from 'store/modules/stake/stake.selectors';

import Wrap from '.';

jest.mock('./components/BalanceMetrics', () => ({ WrapBalanceMetrics: () => <>WrapBalanceMetrics</> }));
jest.mock('./components/UnWrapAction', () => ({ UnWrapAction: () => <>UnWrapAction</> }));
jest.mock('./components/WrapAction', () => ({ WrapAction: () => <>WrapWrapAction</> }));

const renderComponent = () => {
    const mockStore = createMockStore([thunk]);
    const store = mockStore({});

    return render(
        <Provider store={store}>
            <Wrap />
        </Provider>,
    );
};

describe('Wrap', () => {
    it('renders', () => {
        jest.spyOn(AccountSelectorModule, 'selectFormattedStakeBalance').mockReturnValue({
            BASH: '20.00',
            SBASH: '20.00',
        } as any);
        jest.spyOn(StakeSelectorModule, 'selectFormattedIndex').mockReturnThis();
        const comp = renderComponent();

        expect(comp).toMatchSnapshot();
    });
});
