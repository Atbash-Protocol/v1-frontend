import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import * as ReactReduxModule from 'react-redux';

import { Web3Context } from 'contexts/web3/web3.context';
import { BondType } from 'helpers/bond/constants';
import * as BondHookModule from 'hooks/bonds';
import { BondOptions } from 'lib/bonds/bond/bond';
import { LPBond } from 'lib/bonds/bond/lp-bond';
import { BondProviderEnum } from 'lib/bonds/bonds.types';
import mainReducer from 'store/modules/app/app.slice';
import BondsReducer from 'store/modules/bonds/bonds.slice';
import * as BondsReduxModule from 'store/modules/bonds/bonds.thunks';
import marketReducer from 'store/modules/markets/markets.slice';
import transactionReducer from 'store/modules/transactions/transactions.slice';

import BondDialog from '..';

function renderComponent(component: JSX.Element, contextState?: any) {
    return render(
        <Web3Context.Provider value={contextState}>
            <Provider
                store={configureStore({
                    reducer: {
                        main: mainReducer,
                        markets: marketReducer,
                        bonds: BondsReducer,
                        transactions: transactionReducer,
                    },
                    preloadedState: {
                        bonds: {
                            metrics: {},
                            bondQuote: {
                                interestDue: 123,
                            },
                        },
                    } as any,
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
        bonds: {
            loading: false,
        },
    };

    it('renders', () => {
        jest.spyOn(BondHookModule, 'useBondPurchaseReady').mockReturnValue(true);
        const { container } = renderComponent(<BondDialog bond={testBond as any} open={true} />, { state: { signer: 'signer', signerAddress: 'signerAddress' } });
        expect(container).toMatchSnapshot();
    });

    it('dispatches the actions', () => {
        jest.spyOn(ReactReduxModule, 'useDispatch').mockReturnValue(jest.fn());
        jest.spyOn(BondHookModule, 'useBondPurchaseReady').mockReturnValue(true);
        jest.spyOn(BondHookModule, 'selectBondReady').mockReturnValue(false);
        const getTermsSpy = jest.spyOn(BondsReduxModule, 'getBondTerms').mockReturnThis();
        const calcBondDetailsSpy = jest.spyOn(BondsReduxModule, 'calcBondDetails').mockReturnThis();
        const loadBondBalancesAndAllowancesSpy = jest.spyOn(BondsReduxModule, 'loadBondBalancesAndAllowances').mockReturnThis();

        renderComponent(<BondDialog bond={testBond as any} open={true} />, { state: { signer: 'signer', signerAddress: 'signerAddress' } });

        expect(getTermsSpy).toHaveBeenCalledTimes(1);
        expect(getTermsSpy).toHaveBeenCalledWith(testBond);
        expect(calcBondDetailsSpy).toHaveBeenCalledTimes(1);
        expect(calcBondDetailsSpy).toHaveBeenCalledWith({ bond: testBond.bondInstance, value: 0 });
        expect(loadBondBalancesAndAllowancesSpy).toHaveBeenCalledTimes(1);
        expect(loadBondBalancesAndAllowancesSpy).toHaveBeenCalledWith({ address: 'signerAddress' });
    });
});
