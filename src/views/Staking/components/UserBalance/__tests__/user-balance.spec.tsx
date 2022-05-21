import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { Web3Context } from 'contexts/web3/web3.context';
import * as AccountSelectorModule from 'store/modules/account/account.selectors';
import * as MarketsSelectorModule from 'store/modules/markets/markets.selectors';
import * as MetricsSelectorModule from 'store/modules/metrics/metrics.selectors';
import * as StakeSelectorModule from 'store/modules/stake/stake.selectors';

import UserBalance from '..';

const renderComponent = (state?: any) => {
    const mockStore = createMockStore([thunk]);
    const store = mockStore(state);
    const providerValue = { state: { signer: 'signer', signerAddress: 'signerAddress', networkID: 2 } };

    const component = render(
        <Web3Context.Provider value={providerValue as any}>
            <Provider store={store}>
                <UserBalance />
            </Provider>
        </Web3Context.Provider>,
    );

    return {
        component,
        store,
    };
};

describe('UserBalance', () => {
    beforeEach(() => {
        jest.spyOn(AccountSelectorModule, 'selectFormattedStakeBalance').mockReturnValue({
            BASH: '10.00 BASH',
            SBASH: '10.00 SBASH',
            WSBASH: '10.00 WSBASH',
        });
        jest.spyOn(MarketsSelectorModule, 'selectFormattedBashBalance').mockReturnValue('$10.00');
        jest.spyOn(MetricsSelectorModule, 'selectTotalBalance').mockReturnValue('$30.00');
        jest.spyOn(StakeSelectorModule, 'selectStakingBalance').mockReturnValue({
            nextRewardValue: '$25.00',
            wrappedTokenValue: '$10.00',
            effectiveNextRewardValue: '$2300.00',
        });
    });

    it('the userBalance', () => {
        const { component } = renderComponent();

        expect(component).toMatchSnapshot();
    });
});
