import { useCallback, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useWeb3Context } from "hooks/web3";
import { IReduxState } from "store/slices/state.interface";
import ViewBase from "layout/ViewBase";
import { Dashboard, CritialError, NotFound, Stake } from "../views";
import Loading from "components/Loader";

import "./style.scss";
import { getBlockchainData, getCoreMetrics, getStakingMetrics, initializeProviderContracts } from "store/modules/app/app.thunks";
import { MainSliceState } from "store/modules/app/app.types";
import { Route, Switch } from "react-router-dom";
import { getMarketPrices } from "store/modules/markets/markets.thunks";
import { Contract } from "ethers";
import { DEFAULT_NETWORK } from "constants/blockchain";

function App() {
    const dispatch = useDispatch();
    const { provider, chainID, connected, checkWrongNetwork, providerChainID } = useWeb3Context();

    const { errorEncountered, loading, contracts } = useSelector<IReduxState, MainSliceState>(state => state.main, shallowEqual);
    const stakingAddressReady = useSelector<IReduxState, Contract | null>(state => state.main.contracts.STAKING_ADDRESS);
    const marketsLoading = useSelector<IReduxState, boolean>(state => state.markets.loading);

    useEffect(() => {
        dispatch(initializeProviderContracts({ networkID: chainID, provider }));
        dispatch(getBlockchainData(provider));
        dispatch(getMarketPrices());
    }, [connected]);

    useEffect(() => {
        if (contracts.BASH_CONTRACT && contracts.SBASH_CONTRACT && contracts.INITIAL_PAIR_ADDRESS) dispatch(getCoreMetrics());

        if (contracts.STAKING_ADDRESS) {
            dispatch(getStakingMetrics());
        }
    }, [contracts]);

    console.log("here", chainID, DEFAULT_NETWORK, providerChainID);

    if (errorEncountered)
        return (
            <ViewBase>
                <CritialError />
            </ViewBase>
        );

    if (loading || marketsLoading)
        return (
            <ViewBase>
                <Loading />
            </ViewBase>
        );

    return (
        <ViewBase>
            <Switch>
                <Route exact path="/">
                    <Dashboard />
                </Route>

                {connected && (
                    <Route path="/stake">
                        <Stake />
                    </Route>
                )}
                <Route component={NotFound} />
            </Switch>
        </ViewBase>
    );
}

export default App;
