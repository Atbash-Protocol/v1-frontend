import { render } from '@testing-library/react';

import Forecast from '.';

jest.mock('./components/ForecastMetrics', () => () => <>Forecast Metrics</>);

describe('Forecast', () => {
    it('renders', () => {
        const comp = render(<Forecast />);

        expect(comp).toMatchSnapshot();
    });
});
