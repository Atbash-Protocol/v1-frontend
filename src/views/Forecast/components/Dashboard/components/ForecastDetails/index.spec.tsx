import { render } from '@testing-library/react';
import Decimal from 'decimal.js';

import ForecastDetails from '.';
import * as ForecastDetailsHelperModule from './helper';

describe('ForecastDetails', () => {
    it('renders', () => {
        jest.spyOn(ForecastDetailsHelperModule, 'computeDailyROI').mockReturnValue(100);
        jest.spyOn(ForecastDetailsHelperModule, 'getBashRewardsEstimation').mockReturnValue(12000);
        jest.spyOn(ForecastDetailsHelperModule, 'getPotentialReturn').mockReturnValue(12039);
        jest.spyOn(ForecastDetailsHelperModule, 'getLamboEstimation').mockReturnValue(1);

        const props = {
            data: {
                stakedSBAmount: '122.01',
                BASHPriceAtPurchase: '80',
                rewardYieldPercent: '120',
                futureBASHMarketPrice: '1200',
            },
            duration: 10,
            initialPrice: new Decimal(80),
        };

        const container = render(<ForecastDetails {...props} />);

        expect(container).toMatchSnapshot();
    });
});
