import './style.scss';
import { useContext, useEffect } from 'react';

import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import { BondDialog } from 'components/BondDialog';
import { Web3Context } from 'contexts/web3/web3.context';
import { useProvider, useSignerConnected } from 'contexts/web3/web3.hooks';
import useBonds from 'hooks/bonds';
import { getBlockchainData, getCoreMetrics, getStakingMetrics, initializeProviderContracts } from 'store/modules/app/app.thunks';
import { MainSliceState } from 'store/modules/app/app.types';
import { initializeBonds } from 'store/modules/bonds/bonds.thunks';
import { getMarketPrices } from 'store/modules/markets/markets.thunks';
import { IReduxState } from 'store/slices/state.interface';
import BondList from 'views/Bond/BondList/BondList';

import { Dashboard, CritialError, NotFound, Stake, Wrap, Forecast, Redeem } from '../views';

function App(): JSX.Element {
    const dispatch = useDispatch();
    const bonds = useBonds();

    const {
        state: { signer, networkID },
    } = useContext(Web3Context);

    const provider = useProvider();
    const isSignerConnected = useSignerConnected();

    const { errorEncountered, contracts, contractsLoaded } = useSelector<IReduxState, MainSliceState>(state => state.main, shallowEqual);

    // TODO: Create a subscription on signer change
    // TODO: Create a networkID management per provider + signer
    useEffect(() => {
        if (networkID)
            if (isSignerConnected) {
                dispatch(initializeProviderContracts({ signer }));
            } else if (!isSignerConnected && provider && !contractsLoaded) {
                dispatch(initializeProviderContracts({ provider }));
            }
    }, [isSignerConnected, provider, networkID]);

    useEffect(() => {
        if ((provider || signer) && contractsLoaded) {
            dispatch(getBlockchainData(signer || provider));
            dispatch(getCoreMetrics());
            dispatch(getMarketPrices());
            dispatch(initializeBonds(signer || provider));
        }
    }, [provider, contractsLoaded]);

    useEffect(() => {
        if (contracts.STAKING_ADDRESS) {
            dispatch(getStakingMetrics());
        }
    }, [contracts]);

    if (errorEncountered) return <CritialError />;

    return (
        <Switch>
            <Route exact path="/">
                <Dashboard />
            </Route>

            {isSignerConnected && (
                <>
                    <Route path="/stake">
                        <Stake />
                    </Route>

                    <Route path="/bonds">
                        <BondList />
                    </Route>

                    <Route path="/forecast">
                        <Forecast />
                    </Route>

                    <Route path="/wrap">
                        <Wrap />
                    </Route>

                    <Route path="/redeem">
                        <Redeem />
                    </Route>

                    {bonds.mostProfitableBonds.map((bond, key) => (
                        <Route key={key} path={`/mints/${bond.bondInstance.ID}`}>
                            <BondDialog key={bond.bondInstance.bondOptions.displayName} open={true} bond={bond} />
                        </Route>
                    ))}
                </>
            )}
            <Route component={NotFound} />
        </Switch>
    );
}

export default App;
