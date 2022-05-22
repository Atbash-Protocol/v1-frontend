import { render } from '@testing-library/react';

import Forecast from '.';

describe('Forecast', () => {
    it('renders', () => {
        const comp = render(<Forecast />);

        expect(comp).toMatchSnapshot();
    });
});
