import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import { BondDialog } from "components/BondDialog";
import { DEFAULT_NETWORK } from "constants/blockchain";
import { Web3Context } from "contexts/web3/web3.context";
import { BondType } from "helpers/bond/constants";
import { BondOptions } from "lib/bonds/bond/bond";
import { LPBond } from "lib/bonds/bond/lp-bond";
import { BondProviderEnum } from "lib/bonds/bonds.types";
import { Provider } from "react-redux";
import pendingTransactionsReducer from 'store/slices/pending-txns-slice';

import Header from "../index";


function renderComponent(component: JSX.Element, contextState?: any) {
    return render(
        <Web3Context.Provider value={contextState}>
            <Provider
                store={configureStore({
                    reducer: {
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
        const { container } = renderComponent(<Header handleDrawerToggle={() => {}} isSmallScreen={false} />, {
            state: {
              networkID: DEFAULT_NETWORK
            },
            memoConnect: jest.fn(),
            memoDisconnect: jest.fn(),
        });
        expect(container).toMatchSnapshot();
    });


  })