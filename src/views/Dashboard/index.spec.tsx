import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import * as redux from 'react-redux';

import Dashboard from '.';

jest.mock('react-i18next', () => ({
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => {
        return {
            t: (str: string) => str,
            i18n: {
                changeLanguage: () => new Promise(() => {}),
            },
        };
    },
}));

const store = {
    subscribe: jest.fn(),
    dispatch: jest.fn(),
    getState: jest.fn(),
};

const withProvider = (component: JSX.Element, storeProvider: any) => <redux.Provider store={storeProvider}>{component}</redux.Provider>;

describe('NotFound', () => {
    let container: HTMLDivElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    it('renders with loading', () => {
        jest.spyOn(redux, 'useSelector').mockReturnValue({ markets: {} });
        act(() => {
            ReactDOM.render(withProvider(<Dashboard />, store), container);
        });
    });

    it('renders with values', () => {
        jest.spyOn(redux, 'useSelector').mockReturnValue({
            markets: {
                loading: false,
                marketPrice: 0,
                reserves: 0,
                epoch: 0,
            },
        });

        act(() => {
            ReactDOM.render(withProvider(<Dashboard />, store), container);
        });
    });
});
