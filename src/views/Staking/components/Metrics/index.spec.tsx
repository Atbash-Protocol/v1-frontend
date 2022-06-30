import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import Decimal from 'decimal.js';
import { Provider } from 'react-redux';

import * as AppSelectorsModule from 'store/modules/app/app.selectors';
import * as MetricsSelectorsModule from 'store/modules/metrics/metrics.selectors';
import * as StakeSelectorsModule from 'store/modules/stake/stake.selectors';

import StakeMetrics from '.';

function renderComponent(component: JSX.Element) {
    return render(<Provider store={configureStore({ reducer: jest.fn() })}>{component}</Provider>);
}

describe('Metrics', () => {
    it('renders correctly', () => {
        jest.spyOn(AppSelectorsModule, 'selectFormattedReservePrice').mockReturnValue('2.01 BASH');
        jest.spyOn(MetricsSelectorsModule, 'selectStakingRewards').mockReturnValue({ stakingAPY: 1000000 } as any);
        jest.spyOn(MetricsSelectorsModule, 'selectTVL').mockReturnValue(new Decimal(2300));
        jest.spyOn(StakeSelectorsModule, 'selectFormattedIndex').mockReturnValue('2 BASH');

        const comp = renderComponent(<StakeMetrics />);

        expect(comp).toMatchSnapshot();
    });
});
