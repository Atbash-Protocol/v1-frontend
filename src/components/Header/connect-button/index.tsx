import { useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useTranslation } from "react-i18next";
import { PWeb3Context } from "contexts/web3/web3.context";
import { useSignerConnected, useGoodNetworkCheck } from "lib/web3/web3.hooks";
import { Box, Button } from "@mui/material";
import { theme } from "constants/theme";
import { IReduxState } from "store/slices/state.interface";

function ConnectMenu() {
    const { t } = useTranslation();
    const { memoConnect, memoDisconnect, state } = useContext(PWeb3Context);

    const isUserSigned = useSignerConnected();

    const isUserOnGoodNetwork = useGoodNetworkCheck();

    const isOneTransactionPending = useSelector<IReduxState, boolean>(state => state.pendingTransactions.length > 0);

    const handleButtonClick = useCallback(
        e => {
            return isUserSigned ? memoDisconnect() : memoConnect();
        },
        [isUserSigned, memoConnect, memoDisconnect],
    );

    const [buttonText, setButtonText] = useState(t("ConnectWallet"));

    useEffect(() => {
        if (isUserSigned) {
            if (!isUserOnGoodNetwork) {
                setButtonText(t("WrongNetwork"));
            } else if (isOneTransactionPending) {
                setButtonText(t("CountPending", { count: 1 })); // Ususally user can't have more than 1
            } else {
                setButtonText(t("Disconnect"));
            }
        }
    }, [isUserSigned, isOneTransactionPending, isUserOnGoodNetwork]);

    return (
        <Box>
            <Button
                sx={{
                    background: isUserSigned && !isUserOnGoodNetwork ? "red" : "rgba(255, 255, 255, 0.9)",
                    boxShadow: "0px 0px 10px rgba(44, 39, 109, 0.1)",
                    border: "1px solid #30363a",
                    padding: theme.spacing(1),
                }}
                onClick={handleButtonClick}
            >
                {buttonText}
            </Button>
        </Box>
    );
}

export default ConnectMenu;
