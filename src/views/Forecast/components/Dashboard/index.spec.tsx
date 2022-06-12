import { render } from '@testing-library/react';
import Decimal from 'decimal.js';

import Dashboard from '.';

jest.mock('./components/DaysPicker', () => (props: any) => <>{JSON.stringify(props)} </>);
jest.mock('./components/ForecastConfiguration', () => (props: any) => <>{JSON.stringify(props)} </>);
jest.mock('./components/ForecastDetails', () => (props: any) => <>{JSON.stringify(props)} </>);

describe('Dashboard', () => {
    it('renders', async () => {
        const props = {
            BASHPrice: new Decimal(10),
            SBASHBalance: new Decimal(50),
            stakingPercentage: new Decimal(12.293),
        };
        const component = render(<Dashboard {...props} />);

        expect(component).toMatchSnapshot();
    });
});
