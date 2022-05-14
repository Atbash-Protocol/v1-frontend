import './style.scss';
import { lazy, Suspense, useContext, useEffect } from 'react';

import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import Loader from 'components/Loader';
import { Web3Context } from 'contexts/web3/web3.context';
import { useProvider, useSignerConnected } from 'contexts/web3/web3.hooks';
import { getBlockchainData, getCoreMetrics, getStakingMetrics, initializeProviderContracts } from 'store/modules/app/app.thunks';
import { MainSliceState } from 'store/modules/app/app.types';
import { selectBonds } from 'store/modules/bonds/bonds.selector';
import { initializeBonds } from 'store/modules/bonds/bonds.thunks';
import { getMarketPrices } from 'store/modules/markets/markets.thunks';
import { IReduxState } from 'store/slices/state.interface';

import { CritialError, NotFound, Wrap, Forecast, Redeem } from '../views';

const Dashboard = lazy(() => import('views/Dashboard'));
const Stake = lazy(() => import('views/Staking'));
const BondList = lazy(() => import('views/Bond/BondList/BondList'));
const BondDialog = lazy(() => import('../components/BondDialog'));

function App(): JSX.Element {
    const dispatch = useDispatch();

    const {
        state: { signer, networkID },
    } = useContext(Web3Context);

    const provider = useProvider();
    const isSignerConnected = useSignerConnected();

    const bonds = useSelector(selectBonds);
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
    }, [provider, signer, contractsLoaded]);

    useEffect(() => {
        if (contracts.STAKING_CONTRACT) {
            dispatch(getStakingMetrics());
        }
    }, [contracts]);

    if (errorEncountered) return <CritialError />;

    return (
        <Switch>
            <Route exact path="/">
                <Suspense fallback={<Loader />}>
                    <Dashboard />
                </Suspense>
            </Route>

            {isSignerConnected && (
                <>
                    <Route path="/stake">
                        <Suspense fallback={<Loader />}>
                            <Stake />
                        </Suspense>
                    </Route>

                    <Route path="/bonds">
                        <Suspense fallback={<Loader />}>
                            <BondList />
                        </Suspense>
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

                    {bonds.map((bond, key) => (
                        <Route key={key} path={`/mints/${bond.bondInstance.ID}`}>
                            <Suspense fallback={<Loader />}>
                                <BondDialog key={bond.bondInstance.bondOptions.displayName} open={true} bond={bond} />
                            </Suspense>
                        </Route>
                    ))}
                </>
            )}
            <Route component={NotFound} />
        </Switch>
    );
}

export default App;
