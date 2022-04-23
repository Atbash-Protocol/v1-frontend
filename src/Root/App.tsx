import { useCallback, useContext, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useWeb3Context } from "hooks/web3";
import { IReduxState } from "store/slices/state.interface";
import ViewBase from "layout/ViewBase";
import { Dashboard, CritialError, NotFound, Stake, Wrap, Bond, ChooseBond } from "../views";
import Loading from "components/Loader";

import "./style.scss";
import { getBlockchainData, getCoreMetrics, getStakingMetrics, initializeProviderContracts } from "store/modules/app/app.thunks";
import { MainSliceState } from "store/modules/app/app.types";
import { Route, Switch } from "react-router-dom";
import { getMarketPrices } from "store/modules/markets/markets.thunks";
import { Contract } from "ethers";
import { DEFAULT_NETWORK } from "constants/blockchain";
import { initializeBonds } from "store/modules/bonds/bonds.thunks";
import BondList from "views/BondList/BondList";
import { BondDialog } from "components/BondDialog";
import { selectAllBonds } from "store/modules/bonds/bonds.selector";
import useBonds from "hooks/bonds";
import { PWeb3Context } from "contexts/web3/web3.context";
import { Button } from "@mui/material";
import { useGoodNetworkCheck, useProvider, useSignerConnected, useWeb3ContextInitialized } from "lib/web3/web3.hooks";
import _ from "lodash";
import { loadBalancesAndAllowances } from "store/modules/account/account.thunks";

function App() {
    const dispatch = useDispatch();
    // const { provider, chainID, checkWrongNetwork, providerChainID } = useWeb3Context();
    const bonds = useBonds();

    // console.log("bonds");

    const {
        memoConnect,
        memoDisconnect,
        state: { signer, networkID, signerAddress },
    } = useContext(PWeb3Context);

    const provider = useProvider();
    const isSignerConnected = useSignerConnected();
    const isSignerOnGoodNetwork = useGoodNetworkCheck();

    const { errorEncountered, loading, contracts, contractsLoaded } = useSelector<IReduxState, MainSliceState>(state => state.main, shallowEqual);
    const stakingAddressReady = useSelector<IReduxState, Contract | null>(state => state.main.contracts.STAKING_ADDRESS);
    const marketsLoading = useSelector<IReduxState, boolean>(state => state.markets.loading);

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

                    <Route path="/bond">
                        <Bond />
                    </Route>

                    <Route path="/bonds">
                        <BondList />
                    </Route>

                    {bonds.mostProfitableBonds.map((bond, key) => (
                        <Route key={key} path="/mints/bash_dai_lp">
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
