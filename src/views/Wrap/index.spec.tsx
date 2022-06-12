import { render } from '@testing-library/react';

import Wrap from '.';

describe('Wrap', () => {
    it('renders', () => {
        const comp = render(<Wrap />);

        expect(comp).toMatchSnapshot();
    });
});
