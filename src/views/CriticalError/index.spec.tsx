import { render } from '@testing-library/react';

import CriticalError from '.';

describe('CriticalError', () => {
    it('renders', () => {
        const comp = render(<CriticalError />);

        expect(comp).toMatchSnapshot();
    });
});
