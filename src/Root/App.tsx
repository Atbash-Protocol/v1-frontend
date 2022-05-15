import './style.scss';
import { lazy, Suspense, useContext, useEffect, useLayoutEffect } from 'react';

import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import Loader from 'components/Loader';
import { Web3Context } from 'contexts/web3/web3.context';
import { useProvider, useSignerConnected } from 'contexts/web3/web3.hooks';
import { loadBalancesAndAllowances } from 'store/modules/account/account.thunks';
import { selectAppLoading } from 'store/modules/app/app.selectors';
import { getBlockchainData, getCoreMetrics, getStakingMetrics, initializeProviderContracts } from 'store/modules/app/app.thunks';
import { MainSliceState } from 'store/modules/app/app.types';
import { selectBondInstances } from 'store/modules/bonds/bonds.selector';
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
        state: { signer, signerAddress, networkID },
    } = useContext(Web3Context);

    const provider = useProvider();
    const isSignerConnected = useSignerConnected();

    const bondInstances = useSelector(selectBondInstances);
    const { errorEncountered, contractsLoaded } = useSelector<IReduxState, MainSliceState>(state => state.main, shallowEqual);
    const appIsLoading = useSelector(selectAppLoading);

    // // TODO: Create a subscription on signer change
    // // TODO: Create a networkID management per provider + signer
    useLayoutEffect(() => {
        if (networkID)
            if (isSignerConnected) {
                dispatch(initializeProviderContracts({ signer }));
            } else if (!isSignerConnected && provider && !contractsLoaded) {
                dispatch(initializeProviderContracts({ provider }));
            }
    }, [isSignerConnected, provider, networkID]);

    useEffect(() => {
        if ((provider || signer) && contractsLoaded && networkID) {
            batch(() => {
                dispatch(getBlockchainData(signer || provider));
                dispatch(getCoreMetrics());
                dispatch(getStakingMetrics());
                dispatch(getMarketPrices());

                dispatch(initializeBonds(signer || provider));
            });
        }
    }, [provider, signer, contractsLoaded]);

    useEffect(() => {
        if (signerAddress && contractsLoaded) {
            dispatch(loadBalancesAndAllowances(signerAddress));
        }
    }, [signerAddress, contractsLoaded]);

    if (errorEncountered) return <CritialError />;

    if (appIsLoading) {
        return <Loader />;
    }

    return (
        <Switch>
            <Route exact path="/">
                <Suspense fallback={<Loader />}>
                    <Dashboard />
                </Suspense>
            </Route>

            {
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

                    {bondInstances.map((bond, key) => (
                        <Route key={key} path={`/mints/${bond.ID}`}>
                            <Suspense fallback={<Loader />}>
                                <BondDialog key={bond.bondOptions.displayName} open={true} bondID={bond.ID} />
                            </Suspense>
                        </Route>
                    ))}
                </>
            }
            <Route component={NotFound} />
        </Switch>
    );
}

export default App;
