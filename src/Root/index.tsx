import App from "./App";
import { HashRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import { usePWeb3Context } from "contexts/web3/web3.context";
import { useWeb3ContextInitialized } from "lib/web3/web3.hooks";
import Loader from "components/Loader";
import ViewBase from "layout/ViewBase";
import { Box } from "@mui/material";

function Root() {
    const web3ContextReady = useWeb3ContextInitialized();

    if (!web3ContextReady) return <Loader />;

    return <App />;
}

// DOC : Using Hashrouter before viewbase because of the <Link> components in Menu
export const RenderWithViewBase = () => (
    <HashRouter>
        <ViewBase>
            <Root />
        </ViewBase>
    </HashRouter>
);
export default RenderWithViewBase;
