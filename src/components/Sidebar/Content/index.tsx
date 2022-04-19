import { Avatar, Box, Link, List, Divider } from "@mui/material";

import Social from "./components/Social";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TableRowsIcon from "@mui/icons-material/TableRows";
import AccountBalanceSharpIcon from "@mui/icons-material/AccountBalanceSharp"; // GOV
import ShowChartSharpIcon from "@mui/icons-material/ShowChartSharp"; // Forecast
import HandymanSharpIcon from "@mui/icons-material/HandymanSharp"; // Mint
import CurrencyExchangeSharpIcon from "@mui/icons-material/CurrencyExchangeSharp";
import SelfImprovementSharpIcon from "@mui/icons-material/SelfImprovementSharp"; // Pro
import PriceCheckSharpIcon from "@mui/icons-material/PriceCheckSharp";
import StorefrontIcon from "@mui/icons-material/Storefront";

import AtbashICON from "assets/icons/bash.svg";
import { shorten } from "helpers";
import { useAddress, useWeb3Context } from "hooks";
import useBonds from "hooks/bonds";
import useENS from "hooks/useENS";
import Davatar from "@davatar/react";

import { useTranslation } from "react-i18next";
import { getAddresses } from "constants/addresses";
import { DEFAULT_NETWORK } from "constants/blockchain";
import { ListItemLink } from "./components/ListItemLink";
import { getBuyLink } from "lib/uniswap/link";
import { theme } from "constants/theme";

const getMenuItems = (connected: Boolean) => [
    {
        path: "/",
        key: "Dashboard",
        icon: <DashboardIcon />,
        disabled: false,
    },
    {
        path: "/stake",
        key: "Stake",
        icon: <TableRowsIcon />,
        disabled: connected === false,
    },
    {
        path: "/borrow",
        key: "Borrow",
        icon: <CurrencyExchangeSharpIcon />,
        disabled: !connected,
    },
    {
        path: "/mints",
        key: "Minting",
        icon: <HandymanSharpIcon />,
        disabled: !connected,
    },
    {
        path: "/forecast",
        key: "Forecast",
        icon: <ShowChartSharpIcon />,
        disabled: !connected,
    },
];

const cominSoonMenu = [
    {
        path: "/governance",
        key: "Governance",
        icon: <AccountBalanceSharpIcon />,
        disabled: true,
    },
    {
        path: "/borrow",
        key: "Borrow",
        icon: <PriceCheckSharpIcon />,
        disabled: true,
    },
    {
        path: "/404",
        key: "BashPro",
        icon: <SelfImprovementSharpIcon />,
        disabled: true,
    },
];

function NavContent() {
    const { t } = useTranslation();
    const { connected } = useWeb3Context();

    const address = useAddress();
    const bonds = useBonds();
    const { ensName } = useENS(address);

    const addresses = getAddresses(DEFAULT_NETWORK);
    const BASH_ADDRESS = addresses.BASH_ADDRESS;
    const DAI_ADDRESS = addresses.DAI_ADDRESS;

    const menuItems = getMenuItems(connected).map(({ path, key, ...props }) => <ListItemLink key={key} to={path} primary={t(key)} {...props} />);
    let bondItems: JSX.Element[] = [];

    if (bonds) {
        bondItems = bonds.bonds
            .filter(bond => bond.bondInstance.bondOptions.isActive)
            .map(bond => (
                <ListItemLink
                    key={`mint-bond-${bond.bondInstance.ID}`}
                    to={`/mints/${bond.bondInstance.ID}`}
                    primary={bond.bondInstance.bondOptions.displayName}
                    extra={<>{bond.metrics.bondDiscount} %</>}
                />
            ));
    }

    const comingSoonItems = cominSoonMenu.map(({ path, key, ...props }) => <ListItemLink key={key} to={path} primary={t(key)} {...props} />);
    return (
        <Box
            sx={{
                padding: "1rem",
                flexDirection: "column",
                alignItems: "center",
                minWidth: "10rem",
                overflowY: "scroll",
                backgroundColor: theme.palette.cardBackground.main,
                backdropFilter: "blur(100px)",
                color: theme.palette.secondary.main,
                height: "100%",
            }}
        >
            <Box
                sx={{
                    flexDirection: "column",
                    padding: "1rem",
                    width: "100%",
                }}
            >
                <Link href="https://atbash.finance" target="_blank">
                    <Avatar alt="Atbash" src={AtbashICON} sx={{ width: 128, height: 128, textAlign: "center" }} />
                </Link>

                {address && (
                    <Box sx={{ display: "inline-flex", justifyContent: "space-around", marginTop: theme.spacing(2), width: "100%" }}>
                        <Davatar size={20} address={address} generatedAvatarType="jazzicon" />
                        <Link href={`https://etherscan.io/address/${address}`} target="_blank">
                            <p>{ensName || shorten(address)}</p>
                        </Link>
                    </Box>
                )}
            </Box>

            <Box sx={{ marginTop: theme.spacing(1), marginBottom: theme.spacing(4) }}>
                <div>
                    <List
                        sx={{
                            color: theme.palette.secondary.main,
                            "& .MuiListItemButton-root:hover": {
                                textDecoration: "underline",
                            },
                        }}
                    >
                        {menuItems}
                        <Divider />
                        {bondItems}
                        <Divider />
                        <ListItemLink to={getBuyLink(BASH_ADDRESS, DAI_ADDRESS)} primary={t("Buy")} renderComponent={Link} icon={<StorefrontIcon />} />
                        {comingSoonItems}
                    </List>
                </div>
            </Box>

            <Social />
        </Box>
    );
}

export default NavContent;
