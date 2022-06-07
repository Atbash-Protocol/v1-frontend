import { useState } from "react";
import { getAddresses, TOKEN_DECIMALS, DEFAULD_NETWORK } from "../../../constants";
import { useSelector } from "react-redux";
import { Link, Fade, Popper } from "@material-ui/core";
import "./atbash-menu.scss";
import { IReduxState } from "../../../store/slices/state.interface";
import { getTokenUrl } from "../../../helpers";

import { useTranslation } from "react-i18next";

const addTokenToWallet = (tokenSymbol: string, tokenAddress: string) => async () => {
    const tokenImage = getTokenUrl(tokenSymbol.toLowerCase());

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

    const [anchorEl, setAnchorEl] = useState(null);
    const isEthereumAPIAvailable = window.ethereum;

    const networkID = useSelector<IReduxState, number>(state => {
        return (state.app && state.app.networkID) || DEFAULD_NETWORK;
    });

    const addresses = getAddresses(networkID);

    const SBASH_ADDRESS = addresses.SBASH_ADDRESS;
    const BASH_ADDRESS = addresses.BASH_ADDRESS;

    const handleClick = (event: any) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);

    return (
        <div className="bash-menu-root" onMouseEnter={e => handleClick(e)} onMouseLeave={e => handleClick(e)}>
            <div className="bash-menu-btn">
                <p>{t("BuyBASH")}</p>
            </div>

            <Popper className="bash-menu-popper" open={open} anchorEl={anchorEl} transition>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={200}>
                        <div className="tooltip">
                            <Link
                                className="tooltip-item"
                                href={`https://www.traderjoexyz.com/trade?inputCurrency=0x130966628846bfd36ff31a822705796e8cb8c18d&outputCurrency=${BASH_ADDRESS}`}
                                target="_blank"
                            >
                                <p>{t("BuyOnUniswap")}</p>
                            </Link>

                            {isEthereumAPIAvailable && (
                                <div className="add-tokens">
                                    <div className="divider" />
                                    <p className="add-tokens-title">{t("AddTokenToWallet")}</p>
                                    <div className="divider" />
                                    <div className="tooltip-item" onClick={addTokenToWallet("BASH", BASH_ADDRESS)}>
                                        <p>↑ BASH</p>
                                    </div>
                                    <div className="tooltip-item" onClick={addTokenToWallet("sBASH", SBASH_ADDRESS)}>
                                        <p>↑ sBASH</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Fade>
                )}
            </Popper>
        </div>
    );
}

export default AtbashMenu;
