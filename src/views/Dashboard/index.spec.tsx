import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import * as redux from 'react-redux';
import { Provider } from 'react-redux';

import * as AppSelectorsModule from 'store/modules/app/app.selectors';
import * as BondSelectorsModule from 'store/modules/bonds/bonds.selector';
import * as MarketSelectorsModule from 'store/modules/markets/markets.selectors';
import * as MetricsSelectorsModule from 'store/modules/metrics/metrics.selectors';
import * as StakeSelectorsModule from 'store/modules/stake/stake.selectors';

import Dashboard from '.';

const store = {
    subscribe: jest.fn(),
    dispatch: jest.fn(),
    getState: jest.fn(),
};

function renderComponent(component: JSX.Element) {
    return render(<Provider store={configureStore({ reducer: jest.fn() })}>{component}</Provider>);
}

describe('NotFound', () => {
    let container: HTMLDivElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    it('renders with loading', () => {
        jest.spyOn(MarketSelectorsModule, 'selectMarketsLoading').mockReturnValue(true);
        jest.spyOn(AppSelectorsModule, 'selectFormattedReservePrice').mockReturnValue('$20.0');
        jest.spyOn(AppSelectorsModule, 'useContractLoaded').mockReturnValue(true);
        jest.spyOn(AppSelectorsModule, 'selectAppLoading').mockReturnValue(true);
        jest.spyOn(MetricsSelectorsModule, 'selectWSBASHPrice').mockReturnValue('$10.0');
        jest.spyOn(MetricsSelectorsModule, 'selectTVL').mockReturnValue(10000);
        jest.spyOn(MetricsSelectorsModule, 'selectStakingRewards').mockReturnValue(null);
        jest.spyOn(MetricsSelectorsModule, 'selectFormattedMarketCap').mockReturnValue('$200');
        jest.spyOn(StakeSelectorsModule, 'selectFormattedIndex').mockReturnValue('$200');
        jest.spyOn(BondSelectorsModule, 'isAtLeastOneActive').mockReturnValue(true);
        jest.spyOn(BondSelectorsModule, 'selectFormattedTreasuryBalance').mockReturnValue('$200 000');

        const comp = renderComponent(<Dashboard />);

        expect(comp).toMatchSnapshot();
    });

    it('renders with values', () => {
        jest.spyOn(MarketSelectorsModule, 'selectMarketsLoading').mockReturnValue(false);
        jest.spyOn(AppSelectorsModule, 'selectFormattedReservePrice').mockReturnValue('$20.0');
        jest.spyOn(AppSelectorsModule, 'useContractLoaded').mockReturnValue(true);
        jest.spyOn(MetricsSelectorsModule, 'selectWSBASHPrice').mockReturnValue('$10.0');
        jest.spyOn(MetricsSelectorsModule, 'selectTVL').mockReturnValue(10000);
        jest.spyOn(MetricsSelectorsModule, 'selectStakingRewards').mockReturnValue(null);
        jest.spyOn(MetricsSelectorsModule, 'selectFormattedMarketCap').mockReturnValue('$200');
        jest.spyOn(StakeSelectorsModule, 'selectFormattedIndex').mockReturnValue('$200');
        jest.spyOn(BondSelectorsModule, 'isAtLeastOneActive').mockReturnValue(true);
        jest.spyOn(BondSelectorsModule, 'selectFormattedTreasuryBalance').mockReturnValue('$200 000');

        const comp = renderComponent(<Dashboard />);

        expect(comp).toMatchSnapshot();
    });
});
