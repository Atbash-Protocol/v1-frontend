import { setUncaughtExceptionCaptureCallback } from 'process';

import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import * as AppAccountModule from 'store/modules/account/account.selectors';
import * as AppSelectorModule from 'store/modules/app/app.selectors';

import UserStakeMetrics from '..';

function renderComponent(component: JSX.Element) {
    return render(<Provider store={configureStore({ reducer: jest.fn() })}>{component}</Provider>);
}

describe('UserStakeMetrics', () => {
    const balances = {
        BASH: '1 BASH',
        SBASH: '0 SBASH',
        WSBASH: '1 WBASH',
    };
    const stakingInfos = {
        wrappedTokenEquivalent: '0 sBASH',
        nextRewardValue: '0 BASH',
        stakingRebasePercentage: '0.01 %',
        fiveDayRate: '',
        optionalMetrics: false,
        effectiveNextRewardValue: '0.1 wSBASH',
    };

    it('Renders', () => {
        jest.spyOn(AppAccountModule, 'selectFormattedStakeBalance').mockReturnValue({ balances } as any);
        jest.spyOn(AppSelectorModule, 'selectUserStakingInfos').mockReturnValue(stakingInfos);

        const component = renderComponent(<UserStakeMetrics />);

        expect(component).toMatchSnapshot();
    });

    it('Renders with optional metrics', () => {
        jest.spyOn(AppAccountModule, 'selectFormattedStakeBalance').mockReturnValue({ balances } as any);
        jest.spyOn(AppSelectorModule, 'selectUserStakingInfos').mockReturnValue({ ...stakingInfos, optionalMetrics: true });

        const component = renderComponent(<UserStakeMetrics />);

        expect(component).toMatchSnapshot();
    });
});
