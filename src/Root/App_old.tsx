import { useEffect, useState, useCallback, memo } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAddress, useWeb3Context } from "hooks/web3";
import { calcBondDetails } from "store/slices/bond-slice";
import { loadAppDetails } from "store/slices/app-slice";
import { loadAccountDetails, calculateUserBondDetails, calculateUserTokenDetails } from "store/slices/account-slice";
import { IReduxState } from "store/slices/state.interface";
import Loading from "components/Loader";
import useBonds from "hooks/bonds";
import ViewBase from "layout/ViewBase";
import { Stake, Forecast, ChooseBond, Bond, Dashboard, NotFound, Redeem, Wrap } from "../views";

import "./style.scss";
import useTokens from "../hooks/tokens";
// import { initializeContracts, selectContracts } from "store/modules/app/app.slice";

function App() {
    const dispatch = useDispatch();

    const { connect, provider, hasCachedProvider, chainID, connected } = useWeb3Context();
    // const address = useAddress();

    // const [walletChecked, setWalletChecked] = useState(false);

    const isAppLoading = useSelector<IReduxState, boolean>(state => {
        return state.app.loading;
    });
    // const isAppLoaded = useSelector<IReduxState, boolean>(state => !Boolean(state.app.marketPrice));

    const contracts = "test";

    const { bonds } = useBonds();
    // const { tokens } = useTokens();

    async function loadDetails(whichDetails: string) {
        let loadProvider = provider;

        // dispatch(initializeContracts({ networkID: chainID, provider }));
        // if (whichDetails === "app") {
        //     loadApp(loadProvider);
        // }
        // if (whichDetails === "account" && address && connected) {
        //     loadAccount(loadProvider);
        //     if (isAppLoaded) return;
        //     loadApp(loadProvider);
        // }
        // if (whichDetails === "userBonds" && address && connected) {
        //     bonds.map(bond => {
        //         dispatch(calculateUserBondDetails({ address, bond, provider, networkID: chainID }));
        //     });
        // }
        // if (whichDetails === "userTokens" && address && connected) {
        //     tokens.map(token => {
        //         dispatch(calculateUserTokenDetails({ address, token, provider, networkID: chainID }));
        //     });
        // }
    }

    const loadApp = useCallback(
        loadProvider => {
            // dispatch(initializeContracts({ networkID: chainID, provider }));
            // dispatch(loadAppDetails({ networkID: chainID, provider: loadProvider }));
            // bonds.map(bond => {
            //     dispatch(calcBondDetails({ bond, value: null, provider: loadProvider, networkID: chainID }));
            // });
            // tokens.map(token => {
            //     dispatch(calculateUserTokenDetails({ address: "", token, provider, networkID: chainID }));
            // });
        },
        [connected, contracts],
    );

    console.log("p", provider);
    // const loadAccount = useCallback(
    //     loadProvider => {
    //         dispatch(loadAccountDetails({ networkID: chainID, address, provider: loadProvider }));
    //     },
    //     [connected],
    // );

    // useEffect(() => {
    //     if (hasCachedProvider()) {
    //         connect().then(() => {
    //             setWalletChecked(true);
    //         });
    //     } else {
    //         setWalletChecked(true);
    //     }
    // }, []);

    // useEffect(() => {
    //     if (walletChecked || connected) {
    //         loadDetails("app");
    //         // loadDetails("account");
    //         // loadDetails("userBonds");
    //         // loadDetails("userTokens");
    //     }
    // }, [walletChecked, connected]);

    useEffect(() => {
        // loadApp(provider);
    }, [provider]);

    if (contracts) return <Loading />;

    return null;
    // return (
    //     <ViewBase>
    //         <Switch>
    //             <Route exact path="/">
    //                 <Dashboard />
    //             </Route>

    //             <Route path="/stake">
    //                 <Stake />
    //             </Route>

    //             <Route path="/wrap">
    //                 <Wrap />
    //             </Route>

    //             <Route path="/redeem">
    //                 <Redeem />
    //             </Route>

    //             <Route path="/Forecast">
    //                 <Forecast />
    //             </Route>

    //             <Route path="/mints">
    //                 {bonds.map(bond => {
    //                     return (
    //                         <Route exact key={bond.name} path={`/mints/${bond.name}`}>
    //                             <Bond bond={bond} />
    //                         </Route>
    //                     );
    //                 })}
    //                 <ChooseBond />
    //             </Route>

    //             <Route component={NotFound} />
    //         </Switch>
    //     </ViewBase>
    // );
}

export default App;
