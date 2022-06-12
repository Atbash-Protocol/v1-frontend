import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import Decimal from 'decimal.js';
import { Provider } from 'react-redux';

import ForecastMetrics from '.';

jest.mock('components/Metrics/MenuMetric', () => (props: any) => <> {JSON.stringify(props)}</>);

const renderComponent = (component: JSX.Element) => render(<Provider store={configureStore({ reducer: jest.fn() })}>{component}</Provider>);

describe('Metrics', () => {
    it('renders correctly', () => {
        const props = {
            BASHPrice: new Decimal(10),
            SBASHBalance: new Decimal(50),
            stakingPercentage: new Decimal(12.293),
        };

        const component = renderComponent(<ForecastMetrics {...props} />);

        expect(component).toMatchSnapshot();
    });
});
