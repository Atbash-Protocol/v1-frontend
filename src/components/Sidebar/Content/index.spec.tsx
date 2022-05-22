import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import * as Web3HooksModule from 'contexts/web3/web3.hooks';
import * as UseENSHookModule from 'hooks/useENS';
import * as BondSelectorModule from 'store/modules/bonds/bonds.selector';

import NavContent from '.';

function renderComponent(component: JSX.Element, contextState?: any) {
    return render(
        <BrowserRouter>
            <Provider
                store={configureStore({
                    reducer: {},
                })}
            >
                {component}
            </Provider>
            ,
        </BrowserRouter>,
    );
}

describe('Content', () => {
    it('renders', () => {
        jest.spyOn(Web3HooksModule, 'useSignerAddress').mockReturnValue('address');
        jest.spyOn(Web3HooksModule, 'useSignerConnected').mockReturnValue(true);
        jest.spyOn(BondSelectorModule, 'selectMostProfitableBonds').mockReturnValue([[{ bondDiscount: 10 }] as any]);
        jest.spyOn(BondSelectorModule, 'selectBondInstances').mockReturnValue([{ bondOptions: { isActive: true, displayName: 'bond1' } } as any]);
        jest.spyOn(UseENSHookModule, 'default').mockReturnValue({ ensName: 'name' });

        const comp = renderComponent(<NavContent />);

        expect(comp).toBeDefined();
    });
});
