import { render } from '@testing-library/react';
import * as ReactReduxModule from 'react-redux';

import { Web3Context } from 'contexts/web3/web3.context';
import { BondType } from 'helpers/bond/constants';
import { BondOptions } from 'lib/bonds/bond/bond';
import { LPBond } from 'lib/bonds/bond/lp-bond';
import { BondProviderEnum } from 'lib/bonds/bonds.types';
import * as AppSelectorModule from 'store/modules/app/app.selectors';
import * as BondsSeletorModule from 'store/modules/bonds/bonds.selector';
import store from 'store/store';

jest.mock('components/BondDialog/components/Mint', () => ({ Mint: () => <> Mint</> }));
jest.mock('components/BondDialog/components/Redeem', () => ({ Redeem: () => <> Redeem</> }));

import BondDialog from '..';

function renderComponent(component: JSX.Element, contextState?: any) {
    return render(
        <Web3Context.Provider value={contextState}>
            <ReactReduxModule.Provider store={store}>{component}</ReactReduxModule.Provider>,
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

    describe('When the state is not ready', () => {
        it('renders the loader', () => {
            jest.spyOn(BondsSeletorModule, 'selectBondMetricsReady').mockReturnValue(false);
            jest.spyOn(BondsSeletorModule, 'selectBondInstance').mockReturnValue({ bondOptions: { iconPath: 'http://iconpath' }, isLP: () => false } as any);

            const container = renderComponent(<BondDialog bondID={testBond.bondInstance.ID} open={true} />, { state: { signer: 'signer', signerAddress: 'signerAddress' } });

            expect(container.container.getElementsByClassName('MuiCircularProgress-root')).toHaveLength(1);
        });
    });

    describe('When bond data is ready', () => {
        beforeEach(() => {
            jest.spyOn(BondsSeletorModule, 'selectBondMetricsReady').mockReturnValue(true);
            jest.spyOn(BondsSeletorModule, 'selectBondInstance').mockReturnValue(true as any);
        });
        it('should render AccessUnavailablePanel', () => {
            const selectBashPriceMock = jest.spyOn(AppSelectorModule, 'selectFormattedReservePrice').mockReturnValue('$200.00');
            const selectBondInstanceMock = jest.spyOn(BondsSeletorModule, 'selectBondInstance').mockReturnValue(testBond.bondInstance);

            const container = renderComponent(<BondDialog open={true} bondID={'dai'} />);

            expect(selectBashPriceMock).toHaveBeenCalled();
            expect(selectBondInstanceMock).toHaveBeenCalled();
        });
    });
});
