import { render, screen, fireEvent } from '@testing-library/react';
import Decimal from 'decimal.js';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { Web3Context } from 'contexts/web3/web3.context';
import * as AccountSelectorModule from 'store/modules/account/account.selectors';
import * as AppSelectorModule from 'store/modules/app/app.selectors';
import * as MetricsSelectorModule from 'store/modules/metrics/metrics.selectors';

import Staking from './index';

jest.mock('./components/Metrics', () => () => <> Metrics </>);
jest.mock('./components/RebaseTimer', () => () => <> RebaseTimer </>);
jest.mock('./components/Stake', () => () => <> Stake </>);
jest.mock('./components/UserBalance', () => () => <> UserBalance </>);
jest.mock('./components/Stake/StakeMetrics', () => () => <> UserStakeMetrics </>);
jest.mock('components/Loader', () => () => <> Loader </>);

const renderComponent = (state?: any) => {
    const mockStore = createMockStore([thunk]);
    const store = mockStore(state);
    const providerValue = { state: { signer: 'signer', signerAddress: 'signerAddress', networkID: 2 } };

    const component = render(
        <Web3Context.Provider value={providerValue as any}>
            <Provider store={store}>
                <Staking />
            </Provider>
        </Web3Context.Provider>,
    );

    return {
        component,
        store,
    };
};

describe('Staking', () => {
    describe('When the state is not ready', () => {
        it('returns the loader', async () => {
            jest.spyOn(AccountSelectorModule, 'selectAccountLoading').mockReturnValue(true);
            jest.spyOn(MetricsSelectorModule, 'selectStakingRewards').mockReturnValue(null);
            renderComponent();

            await expect(screen.findAllByText('Loader')).resolves.toBeDefined();
        });
    });

    describe('When the state is ready', () => {
        beforeEach(async () => {
            jest.spyOn(AccountSelectorModule, 'selectAccountLoading').mockReturnValue(false);
            jest.spyOn(MetricsSelectorModule, 'selectStakingRewards').mockReturnValue({
                fiveDayRate: 10.2,
                stakingAPY: 10093,
                stakingReward: 100000,
                stakingRebase: new Decimal(2003),
            });
        });

        it('loads the balances and allowances', async () => {
            jest.spyOn(AppSelectorModule, 'useContractLoaded').mockReturnValue(true);
            const { store } = renderComponent();

            expect(store.getActions()).toHaveLength(1);
        });
    });
});
