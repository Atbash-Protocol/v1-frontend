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

function App() {
    const dispatch = useDispatch();
    // const { provider, chainID, checkWrongNetwork, providerChainID } = useWeb3Context();
    // const bonds = useBonds();

    // console.log("bonds");

    const {
        memoConnect,
        memoDisconnect,
        state: { signer, networkID },
    } = useContext(PWeb3Context);

    const provider = useProvider();
    const isSignerConnected = useSignerConnected();
    const isSignerOnGoodNetwork = useGoodNetworkCheck();

    const { errorEncountered, loading, contracts, contractsLoaded } = useSelector<IReduxState, MainSliceState>(state => state.main, shallowEqual);
    // const stakingAddressReady = useSelector<IReduxState, Contract | null>(state => state.main.contracts.STAKING_ADDRESS);
    // const marketsLoading = useSelector<IReduxState, boolean>(state => state.markets.loading);

    useEffect(() => {
        if (provider && provider !== null && !signer) {
            dispatch(initializeProviderContracts({ provider } as any));
        }

        if (!provider && !signer) {
            dispatch(initializeProviderContracts({ signer } as any)); // TODO change
        }
    }, [provider, signer]);

    const handleConnect = useCallback(() => {
        if (!signer) memoConnect();
    }, [signer]);

    const handleDisconnect = useCallback(() => {
        memoDisconnect();
    }, [signer]);

    // TODO: Create a subscription on signer change
    // useEffect(() => {
    //     if (!isSignerConnected && provider && contractsLoaded) {
    //         dispatch(initializeProviderContracts({ networkID: chainID, provider }));
    //     }

    //     if (!signer && web3Provider) {
    //         dispatch(initializeProviderContracts({ provider, networkID: chainID }));
    //     }
    // }, [connected]);

    // useEffect(() => {
    //     if (connected && contractsLoaded) {
    //         dispatch(getBlockchainData(provider));
    //         dispatch(getCoreMetrics());
    //         dispatch(getMarketPrices());
    //         dispatch(initializeBonds(provider));
    //     }
    // }, [connected, contractsLoaded]);

    // useEffect(() => {
    //     if (contracts.STAKING_ADDRESS) {
    //         dispatch(getStakingMetrics());
    //     }
    // }, [contracts]);

    // if ([provider, signer, networkID].some(e => e === null)) return null;

    if (errorEncountered) return <CritialError />;

    return (
        <Switch>
            <Route exact path="/">
                <Dashboard />
            </Route>
            {/*
                {connected && (
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

                        {bonds.mostProfitableBonds.map(bond => (
                            <Route path="/mints/bash_dai_lp">
                                <BondDialog key={bond.bondInstance.bondOptions.displayName} open={true} bond={bond} />
                            </Route>
                        ))}
                    </>
                )}
                <Route component={NotFound} /> */}
        </Switch>
    );
}

export default App;
