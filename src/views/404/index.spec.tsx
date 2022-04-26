import { render } from '@testing-library/react';

import { NotFound } from 'views';

describe('NotFound', () => {
    it('renders', () => {
        const { container } = render(<NotFound />);

        expect(container).toMatchSnapshot();
    });
});
