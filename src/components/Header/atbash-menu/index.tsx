import { useState } from "react";
import { getAddresses, TOKEN_DECIMALS, DEFAULT_NETWORK } from "../../../constants";
import { useSelector } from "react-redux";
import { Link, Fade, Popper } from "@material-ui/core";
import { IReduxState } from "../../../store/slices/state.interface";
// import { getTokenUrl } from "../../../helpers";

import { useTranslation } from "react-i18next";
import { Box, Button, Divider, Popover, Typography } from "@mui/material";
import { theme } from "constants/theme";
import { useSignerConnected } from "lib/web3/web3.hooks";
import { getBuyLink } from "lib/uniswap/link";
import { usePWeb3Context } from "contexts/web3/web3.context";

const addTokenToWallet = (tokenSymbol: string, tokenAddress: string) => async () => {
    // const tokenImage = getTokenUrl(tokenSymbol.toLowerCase());
    const tokenImage = "";

    if (window.ethereum) {
        try {
            await window.ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20",
                    options: {
                        address: tokenAddress,
                        symbol: tokenSymbol,
                        decimals: TOKEN_DECIMALS,
                        image: tokenImage,
                    },
                },
            });
        } catch (error) {
            console.log(error);
        }
    }
};

function AtbashMenu() {
    const { t } = useTranslation();

    const isUserSigned = useSignerConnected();
    const [anchorEl, setAnchorEl] = useState(null);

    const {
        state: { networkID },
    } = usePWeb3Context();

    if (!networkID) return null;

    const addresses = getAddresses(networkID);

    const SBASH_ADDRESS = addresses.SBASH_ADDRESS;
    const BASH_ADDRESS = addresses.BASH_ADDRESS;
    const DAI_ADDRESS = addresses.DAI_ADDRESS;

    const handleClick = (event: any) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);
    const id = open ? "menu-popover" : undefined;

    return (
        <Box sx={{ padding: theme.spacing(1) }} onMouseEnter={e => handleClick(e)} onMouseLeave={e => handleClick(e)}>
            <Button>
                <Typography>{t("BuyBASH")}</Typography>
            </Button>

            <Popper open={open} anchorEl={anchorEl} transition>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={200}>
                        <Box sx={{ background: theme.palette.cardBackground.light }}>
                            <Link href={getBuyLink(DAI_ADDRESS, BASH_ADDRESS)} component={Typography} target="_blank">
                                {t("BuyOnUniswap")}
                            </Link>

                            {isUserSigned && (
                                <Box sx={{ color: theme.palette.primary.light }}>
                                    <Typography>{t("AddTokenToWallet")}</Typography>
                                    <Divider />
                                    <Typography sx={{ cursor: "pointer" }} onClick={addTokenToWallet("BASH", BASH_ADDRESS)}>
                                        ↑ BASH
                                    </Typography>
                                    <Typography sx={{ cursor: "pointer" }} onClick={() => addTokenToWallet("sBASH", SBASH_ADDRESS)}>
                                        ↑ sBASH
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Fade>
                )}
            </Popper>
        </Box>
    );
}

export default AtbashMenu;
