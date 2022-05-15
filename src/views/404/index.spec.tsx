import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import boundReducer from 'store/modules/bonds/bonds.slice';
import { NotFound } from 'views';

function renderComponent(component: JSX.Element, preloadedState: any = {}) {
    return render(
        <Provider
            store={configureStore({
                reducer: {
                    bonds: boundReducer,
                },
                preloadedState,
            })}
        >
            {component}
        </Provider>,
    );
}

describe('NotFound', () => {
    it('renders with loader', () => {
        const { container } = renderComponent(<NotFound />, { bonds: { bondInstances: [] } });

        expect(container.querySelectorAll('.MuiCircularProgress-root').length).not.toBe(0);
    });

    it('renders not found', () => {
        const component = renderComponent(<NotFound />, { bonds: { bondInstances: [{ bondOptions: {} as any }] } });

        expect(component.container.querySelectorAll('.MuiCircularProgress-root')).toHaveLength(0);
        expect(component.findAllByText(/PageNotFound/)).toBeDefined();
    });
});
