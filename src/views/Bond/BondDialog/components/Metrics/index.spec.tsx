import { render } from '@testing-library/react';

import * as BondSelectorModule from 'store/modules/bonds/bonds.selector';
import { renderComponent } from 'tests/utils';

import BondMetrics from '.';

describe('BondMetrics', () => {
    it('renders the metrics', () => {
        jest.spyOn(BondSelectorModule, 'selectBondMintingMetrics').mockReturnValue({
            maxBondPrice: 10,
            balance: '20 BASH',
            quote: '$2000',
            bondDiscount: '50%',
            vestingTerm: 10,
        } as any);

        const bondMetrics = {
            treasuryBalance: null,
            bondDiscount: null,
            bondQuote: null,
            purchased: null,
            vestingTerm: null,
            maxBondPrice: null,
            bondPrice: null,
            marketPrice: null,
            maxBondPriceToken: null,
            allowance: null,
            balance: null,
        };
        const { container } = render(<BondMetrics bondMetrics={bondMetrics} />);

        expect(container).toMatchSnapshot();
    });
});
