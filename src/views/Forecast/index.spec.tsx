import { render, screen } from '@testing-library/react';
import Decimal from 'decimal.js';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';

import * as AccountSelectorModule from 'store/modules/account/account.selectors';
import * as MarketsSelectorModule from 'store/modules/markets/markets.selectors';
import * as MetricsSelectorModule from 'store/modules/metrics/metrics.selectors';

import Forecast from '.';

jest.mock('./components/Dashboard/components/ForecastMetrics', () => () => <>Forecast Metrics</>);
jest.mock('./components/Dashboard', () => (props: any) => <>Dashboard {JSON.stringify(props)}</>);

describe('Forecast', () => {
    it('renders', async () => {
        jest.spyOn(AccountSelectorModule, 'selectSBASHBalance').mockReturnValue(new Decimal(10.93));
        jest.spyOn(MarketsSelectorModule, 'selectComputedMarketPrice').mockReturnValue(new Decimal(82.23));
        jest.spyOn(MetricsSelectorModule, 'selectStakingRebasePercentage').mockReturnValue(new Decimal(20));

        const mockStore = createMockStore([]);
        const store = mockStore({});

        const comp = render(
            <Provider store={store}>
                <Forecast />
            </Provider>,
        );

        expect(comp).toMatchSnapshot();
    });
});
