import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Web3Context } from 'contexts/web3/web3.context';
import { BondType } from 'helpers/bond/constants';
import { BondOptions } from 'lib/bonds/bond/bond';
import { LPBond } from 'lib/bonds/bond/lp-bond';
import { BondProviderEnum } from 'lib/bonds/bonds.types';
import { Provider } from 'react-redux';
import { BondDialog } from '..';
import mainReducer from 'store/modules/app/app.slice';
import marketReducer from 'store/modules/markets/markets.slice';
import pendingTransactionsReducer from 'store/slices/pending-txns-slice';

import * as BondHookModule from 'hooks/bonds';
import * as BondsReduxModule from 'store/modules/bonds/bonds.thunks';

function renderComponent(component: JSX.Element, contextState?: any) {
    return render(
        <Web3Context.Provider value={contextState}>
            <Provider
                store={configureStore({
                    reducer: {
                        main: mainReducer,
                        markets: marketReducer,
                        pendingTransactions: pendingTransactionsReducer,
                    },
                })}
            >
                {component}
            </Provider>
            ,
        </Web3Context.Provider>,
    );
}

describe('BondDialog', () => {
    const bondOptions: BondOptions = {
        name: 'bond',
        displayName: 'bondToDisplay',
        token: 'token',
        iconPath: 'path',
        lpProvider: BondProviderEnum.UNISWAP_V2,
        type: BondType.LP,
        networkID: 2,
        isActive: true,
    };

    const testBond = {
        bondInstance: new LPBond(bondOptions),
        metrics: {
            reserves: 0,
        },
        terms: {},
    };

    it('renders', () => {
        jest.spyOn(BondHookModule, 'useBondPurchaseReady').mockReturnValue(true);
        const { container } = renderComponent(<BondDialog bond={testBond as any} open={true} />, { state: { signer: 'signer', signerAddress: 'signerAddress' } });
        expect(container).toMatchSnapshot();
    });

    it('dispatches the actions ', () => {
        jest.spyOn(BondHookModule, 'useBondPurchaseReady').mockReturnValue(true);
        jest.spyOn(BondHookModule, 'selectBondReady').mockReturnValue(false);
        const getTermsSpy = jest.spyOn(BondsReduxModule, 'getBondTerms');
        const calcBondDetailsSpy = jest.spyOn(BondsReduxModule, 'calcBondDetails');
        const loadBondBalancesAndAllowancesSpy = jest.spyOn(BondsReduxModule, 'loadBondBalancesAndAllowances');

        renderComponent(<BondDialog bond={testBond as any} open={true} />, { state: { signer: 'signer', signerAddress: 'signerAddress' } });


        expect(getTermsSpy).toHaveBeenCalled();
        expect(calcBondDetailsSpy).toHaveBeenCalled();
        expect(loadBondBalancesAndAllowancesSpy).toHaveBeenCalled();
    });

});
