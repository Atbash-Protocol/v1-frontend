import App from "./App";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { useProvider, useWeb3ContextInitialized } from "lib/web3/web3.hooks";
import Loader from "components/Loader";
import ViewBase from "layout/ViewBase";
import { usePWeb3Context } from "contexts/web3/web3.context";
import { useEffect } from "react";

function Root() {
    const web3ContextReady = useWeb3ContextInitialized();

    if (!web3ContextReady) return <Loader />;

    return <App />;
}

// DOC : Using BrowserRouter before viewbase because of the <Link> components in Menu
export const RenderWithViewBase = () => (
    <BrowserRouter>
        <ViewBase>
            <Root />
        </ViewBase>
    </BrowserRouter>
);
export default RenderWithViewBase;
