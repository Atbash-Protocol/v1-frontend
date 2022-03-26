import { NavLink } from "react-router-dom";
import Social from "../Social";
import StakeIcon from "assets/icons/stake.svg";
import BondIcon from "assets/icons/bond.svg";
import BuyIcon from "assets/icons/buy.svg";
import BorrowIcon from "assets/icons/borrow.svg";
import Forecast from "assets/icons/Forecast.svg";
import GovIcon from "assets/icons/governance.svg";

import AtbashICON from "assets/icons/bash.svg";
import DashboardIcon from "assets/icons/dashboard.svg";
import { trim, shorten } from "helpers";
import { useAddress } from "hooks";
import useBonds from "hooks/bonds";
import { Link } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import "./styles.scss";
import useENS from "hooks/useENS";
import Davatar from "@davatar/react";

import { useTranslation } from "react-i18next";
import { getAddresses } from "constants/addresses";
import { DEFAULT_NETWORK } from "constants/blockchain";

function NavContent() {
    const { t } = useTranslation();

    const address = useAddress();
    const { bonds } = useBonds();
    const { ensName } = useENS(address);

    const addresses = getAddresses(DEFAULT_NETWORK);
    const BASH_ADDRESS = addresses.BASH_ADDRESS;
    const DAI_ADDRESS = addresses.DAI_ADDRESS;

    return (
        <div className="dapp-sidebar">
            <div className="branding-header">
                <Link href="https://atbash.finance" target="_blank">
                    <img alt="" src={AtbashICON} />
                </Link>

                {address && (
                    <div className="wallet-link">
                        <Davatar size={20} address={address} generatedAvatarType="jazzicon" />
                        <Link href={`https://etherscan.io/address/${address}`} target="_blank">
                            <p>{ensName || shorten(address)}</p>
                        </Link>
                    </div>
                )}
            </div>

            <div className="dapp-menu-links">
                <div className="dapp-nav">
                    <Link component={NavLink} to="/" className="button-dapp-menu">
                        <div className="dapp-menu-item">
                            <img alt="" src={DashboardIcon} />
                            <p>{t("Dashboard")}</p>
                        </div>
                    </Link>

                    <Link component={NavLink} to="/stake" className="button-dapp-menu">
                        <div className="dapp-menu-item">
                            <img alt="" src={StakeIcon} />
                            <p>{t("Stake")}</p>
                        </div>
                    </Link>

                    <Link component={NavLink} id="wrap-nav" to="/wrap" className="button-dapp-menu">
                        <div className="dapp-menu-item">
                            <img alt="" src={BorrowIcon} />

                            <p>{t("Wrap")}</p>
                        </div>
                    </Link>

                    <Link component={NavLink} id="bond-nav" to="/mints" className="button-dapp-menu">
                        <div className="dapp-menu-item">
                            <img alt="" src={BondIcon} />
                            <p>{t("Minting")}</p>
                        </div>
                    </Link>

                    <div className="bond-discounts">
                        <p className="bond-discounts-title">{t("MintingDiscounts")}</p>
                        {bonds
                            .filter(bond => bond.isActive)
                            .map((bond, i) => (
                                <Link component={NavLink} to={`/mints/${bond.name}`} key={i} className={"bond"}>
                                    {!bond.bondDiscount ? (
                                        <Skeleton variant="text" width={"150px"} />
                                    ) : (
                                        <p>
                                            {bond.displayName}
                                            <span className="bond-pair-roi">{bond.bondDiscount && trim(bond.bondDiscount * 100, 2)}%</span>
                                        </p>
                                    )}
                                </Link>
                            ))}
                    </div>

                    <Link href={`https://app.uniswap.org/#/swap?chain=rinkeby&inputCurrency=${DAI_ADDRESS}&outputCurrency=${BASH_ADDRESS}`} target="_blank">
                        <div className="button-dapp-menu">
                            <div className="dapp-menu-item">
                                <img alt="" src={BuyIcon} />
                                <p>{t("Buy")}</p>
                            </div>
                        </div>
                    </Link>

                    <Link component={NavLink} to="/Forecast" className="button-dapp-menu">
                        <div className="button-dapp-menu">
                            <div className="dapp-menu-item">
                                <img alt="" src={Forecast} />
                                <p>{t("Forecast")}</p>
                            </div>
                        </div>
                    </Link>

                    <Link component={NavLink} id="bond-nav" to="#" className="button-dapp-menu">
                        <div className="dapp-menu-item">
                            <img alt="" src={BorrowIcon} />
                            <p>{t("Borrow")}</p>
                            <span>{t("ComingSoon")}</span>
                        </div>
                    </Link>

                    {/* <Link component={NavLink} id="bond-nav" to="#" className="button-dapp-menu">
                        <div className="dapp-menu-item">
                            <img alt="" src={ProIcon} />
                            <p>{t("BASHPro")}</p>
                            <span>{t("ComingSoon")}</span>
                        </div>
                    </Link> */}

                    <Link href="https://snapshot.org/" target="_blank" className="button-dapp-menu">
                        <div className="dapp-menu-item">
                            <img alt="" src={GovIcon} />
                            <p>{t("Governance")}</p>
                        </div>
                    </Link>
                </div>
            </div>

            <Social />
        </div>
    );
}

export default NavContent;