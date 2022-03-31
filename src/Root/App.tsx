import { useEffect, useState, useCallback, memo } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useAddress, useWeb3Context } from "hooks/web3";
import { calcBondDetails } from "store/slices/bond-slice";
import { loadAppDetails } from "store/slices/app-slice";
import { loadAccountDetails, calculateUserBondDetails, calculateUserTokenDetails } from "store/slices/account-slice";
import { IReduxState } from "store/slices/state.interface";
import Loading from "components/Loader";
import useBonds from "hooks/bonds";
import ViewBase from "layout/ViewBase";
import { Stake, Forecast, ChooseBond, Bond, Dashboard, NotFound, Redeem, Wrap, CritialError } from "../views";

import "./style.scss";
import useTokens from "../hooks/tokens";
import { initiaContracts, selectContracts } from "store/modules/app/app.slice";
import { getBlockchainData, getCoreMetrics } from "store/modules/app/app.thunks";
import { createSelector } from "@reduxjs/toolkit";
import { MainSliceState } from "store/modules/app/app.types";

function App() {
    const contracts = "Contracts";
    const dispatch = useDispatch();

    const { connect, provider, hasCachedProvider, chainID, connected } = useWeb3Context();

    const { errorEncountered } = useSelector<IReduxState, MainSliceState>(state => state.main, shallowEqual);

    useEffect(() => {
        console.log("Rendering APP ", connected, connect, provider, hasCachedProvider());
        dispatch(initiaContracts({ networkID: chainID, provider }));
        dispatch(getBlockchainData(provider));
        dispatch(getCoreMetrics());
    }, [provider]);

    if (errorEncountered)
        return (
            <ViewBase>
                <CritialError />
            </ViewBase>
        );

    return (
        <ViewBase>
            <Switch>
                <Route exact path="/">
                    <Dashboard />
                </Route>
            </Switch>
        </ViewBase>
    );
}

const MemoizedApp = memo(App, (prevProps, nextProps) => {
    console.log("Here render ?", prevProps, nextProps);

    /*
      When using this function you always need to return
      a Boolean. For now we'll say the props are NOT equal 
      which means the component should rerender.
    */
    return false;
});
export default MemoizedApp;
