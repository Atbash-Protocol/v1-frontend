import { Typography } from '@mui/material';
import { render } from '@testing-library/react';

import { BCard } from 'components/BCard';

describe('BCard', () => {
    it('renders', () => {
        const child = <div id="child">child</div>;
        const { container } = render(<BCard title="title" children={child} zoom={true} />);

        expect(container).toMatchSnapshot();
        expect(container.querySelector('#child')).toBeTruthy();
    });
});
