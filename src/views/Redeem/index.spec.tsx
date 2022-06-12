import { render } from '@testing-library/react';

import Redeem from '.';

describe('Redeem', () => {
    it('renders', () => {
        const comp = render(<Redeem />);

        expect(comp).toMatchSnapshot();
    });
});
