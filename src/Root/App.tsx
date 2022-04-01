import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useWeb3Context } from "hooks/web3";
import { IReduxState } from "store/slices/state.interface";
import ViewBase from "layout/ViewBase";
import { Dashboard, CritialError, NotFound } from "../views";
import Loading from "components/Loader";

import "./style.scss";
import { getBlockchainData, getCoreMetrics, getStakingMetrics } from "store/modules/app/app.thunks";
import { MainSliceState } from "store/modules/app/app.types";
import { Route, Switch } from "react-router-dom";
import { initializeContracts } from "store/modules/app/app.slice";
import { getMarketPrices } from "store/modules/markets/markets.thunks";

function App() {
    const dispatch = useDispatch();
    const { provider, chainID } = useWeb3Context();

    const { errorEncountered, loading } = useSelector<IReduxState, MainSliceState>(state => state.main, shallowEqual);

    useEffect(() => {
        dispatch(initializeContracts({ networkID: chainID, provider }));
        dispatch(getBlockchainData(provider));
        dispatch(getCoreMetrics());
        dispatch(getStakingMetrics());
    }, []);

    // useEffect(() => {
    //     console.log("Re render", errorEncountered, loading);
    // }, []);

    // if (errorEncountered)
    //     return (
    //         <ViewBase>
    //             <CritialError />
    //         </ViewBase>
    //     );

    // if (loading)
    //     return (
    //         <ViewBase>
    //             <Loading />
    //         </ViewBase>
    //     );

    return (
        <ViewBase>
            <Switch>
                <Route exact path="/">
                    <Dashboard />
                </Route>
                <Route component={NotFound} />
            </Switch>
        </ViewBase>
    );
}

export default App;
