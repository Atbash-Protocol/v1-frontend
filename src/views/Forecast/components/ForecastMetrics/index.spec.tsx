import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import Decimal from 'decimal.js';
import { Provider } from 'react-redux';

import * as AccountSelectorModule from 'store/modules/account/account.selectors';
import * as AppSelectorsModule from 'store/modules/app/app.selectors';
import * as MetricsSelectorsModule from 'store/modules/metrics/metrics.selectors';

import ForecastMetrics from '.';

function renderComponent(component: JSX.Element) {
    return render(<Provider store={configureStore({ reducer: jest.fn() })}>{component}</Provider>);
}

describe('Metrics', () => {
    it('renders correctly', () => {
        jest.spyOn(AccountSelectorModule, 'selectSBASHBalance').mockReturnValue(new Decimal(2));
        jest.spyOn(AppSelectorsModule, 'selectFormattedReservePrice').mockReturnValue('$30.00');
        jest.spyOn(MetricsSelectorsModule, 'selectStakingRebasePercentage').mockReturnValue(new Decimal('12.023'));

        const comp = renderComponent(<ForecastMetrics />);

        expect(screen.findAllByText('BASHPrice')).toBeDefined();
        expect(screen.findAllByText('globe:CurrentRewardYield')).toBeDefined();
        expect(screen.findAllByText('globe:YourStakedBASHBalance')).toBeDefined();
    });
});
