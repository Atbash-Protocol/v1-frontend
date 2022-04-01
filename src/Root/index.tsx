import React, { useEffect, useState } from "react";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { loadTokenPrices } from "../helpers";
import Loading from "../components/Loader";

function Root() {
    return (
        <HashRouter>
            <App />
        </HashRouter>
    );
}

export default Root;
