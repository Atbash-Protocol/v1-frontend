import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { DateTime } from 'luxon';
import { Provider } from 'react-redux';

import * as FormatTimeModule from 'helpers/prettify-seconds';
import * as AppReduxSelectorModule from 'store/modules/app/app.selectors';

import RebaseTimer from '..';

function renderComponent(component: JSX.Element) {
    return render(<Provider store={configureStore({ reducer: jest.fn() })}>{component}</Provider>);
}
describe('RebaseTimer', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('renders the loader', () => {
        jest.spyOn(AppReduxSelectorModule, 'useNextRebase').mockReturnValue(undefined);
        jest.spyOn(AppReduxSelectorModule, 'useBlockchainInfos').mockReturnValue({ timestamp: null, currentBlock: null });

        const rebaseTimer = renderComponent(<RebaseTimer />);

        expect(rebaseTimer).toMatchSnapshot();
    });

    it('renders on rebasing mode', () => {
        const currentBlockTime = DateTime.utc().toMillis();
        const nextRebase = DateTime.utc().minus({ hour: 2 }).toMillis();

        jest.spyOn(AppReduxSelectorModule, 'useNextRebase').mockReturnValue(nextRebase);
        jest.spyOn(AppReduxSelectorModule, 'useBlockchainInfos').mockReturnValue({ timestamp: currentBlockTime, currentBlock: null });

        const rebaseTimer = renderComponent(<RebaseTimer />);

        expect(rebaseTimer).toMatchSnapshot();
    });

    it('renders with a timer', () => {
        const formatTimerSpy = jest.spyOn(FormatTimeModule, 'formatTimer');
        const currentBlockTime = DateTime.utc().toMillis();
        const nextRebase = DateTime.utc().plus({ hour: 2 }).toMillis();

        jest.spyOn(AppReduxSelectorModule, 'useNextRebase').mockReturnValue(nextRebase);
        jest.spyOn(AppReduxSelectorModule, 'useBlockchainInfos').mockReturnValue({ timestamp: currentBlockTime, currentBlock: 1 });

        const rebaseTimer = renderComponent(<RebaseTimer />);

        expect(rebaseTimer).toMatchSnapshot();

        expect(formatTimerSpy).toHaveBeenCalledTimes(1);
        expect(formatTimerSpy).toHaveBeenCalledWith(currentBlockTime, nextRebase, expect.any(Function));
    });
});
