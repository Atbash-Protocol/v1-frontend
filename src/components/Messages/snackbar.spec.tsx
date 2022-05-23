import { createRef, forwardRef } from 'react';

import { render } from '@testing-library/react';

import { BSnackBar } from './snackbar';

describe('snackBar', () => {
    const MyComponent = forwardRef<any>((props, ref) => <BSnackBar ref={ref} severity="info" description="description" />);

    it('renders', () => {
        const ref = createRef();

        const comp = render(<MyComponent />);

        expect(comp).toMatchSnapshot();
    });
});
