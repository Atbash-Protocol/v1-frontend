import { fireEvent, render, screen } from '@testing-library/react';

import Configuration from '.';

describe('Configuration', () => {
    const props = {
        onConfigurationChange: jest.fn(),
        initialData: {
            stakedSBAmount: '122.01',
            BASHPriceAtPurchase: '80',
            rewardYieldPercent: '120',
            futureBASHMarketPrice: '1200',
        },
    };

    it('renders', () => {
        const comp = render(<Configuration {...props} />);

        expect(comp).toMatchSnapshot();
    });

    it('fires an configurationChange event', async () => {
        const { container } = render(<Configuration {...props} />);

        const input = await container.querySelector('input');
        fireEvent.change(input!, { target: { value: '20' } });

        expect(props.onConfigurationChange).toHaveBeenCalledWith({ ...props.initialData, stakedSBAmount: '20' });
    });
});
