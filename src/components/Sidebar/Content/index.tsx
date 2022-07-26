// import Davatar from '@davatar/react';
import { useMemo } from 'react';

import AccountBalanceSharpIcon from '@mui/icons-material/AccountBalanceSharp';
// Mint
import CurrencyExchangeSharpIcon from '@mui/icons-material/CurrencyExchangeSharp';
import DashboardIcon from '@mui/icons-material/Dashboard';
// Forecast
import HandymanSharpIcon from '@mui/icons-material/HandymanSharp';
// Pro
import PriceCheckSharpIcon from '@mui/icons-material/PriceCheckSharp';
import SelfImprovementSharpIcon from '@mui/icons-material/SelfImprovementSharp';
// GOV
import ShowChartSharpIcon from '@mui/icons-material/ShowChartSharp';
import StorefrontIcon from '@mui/icons-material/Storefront';
import TableRowsIcon from '@mui/icons-material/TableRows';
import { Avatar, Box, Link, List, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import AtbashICON from 'assets/icons/bash-compress.svg';
import { getAddresses } from 'constants/addresses';
import { DEFAULT_NETWORK } from 'constants/blockchain';
import { theme } from 'constants/theme';
import { useSignerAddress, useSignerConnected } from 'contexts/web3/web3.hooks';
import { shorten } from 'helpers/shorten';
import useENS from 'hooks/useENS';
import { getBuyLink } from 'lib/uniswap/link';
import { selectBondInstances, selectMostProfitableBonds } from 'store/modules/bonds/bonds.selector';

import { ListItemLink } from './components/ListItemLink';
import Social from './components/Social';

const getMenuItems = (connected: boolean) => [
    {
        path: '/',
        key: 'Dashboard',
        icon: <DashboardIcon />,
        disabled: false,
    },
    {
        path: '/stake',
        key: 'Stake',
        icon: <TableRowsIcon />,
        disabled: connected === false,
    },
    {
        path: '/bonds',
        key: 'Minting',
        icon: <HandymanSharpIcon />,
        disabled: !connected,
    },
    {
        path: '/forecast',
        key: 'Forecast',
        icon: <ShowChartSharpIcon />,
        disabled: !connected,
    },
    {
        path: '/wrap',
        key: 'Wrap',
        icon: <CurrencyExchangeSharpIcon />,
        disabled: !connected,
    },
];

const cominSoonMenu = [
    {
        path: '/governance',
        key: 'Governance',
        icon: <AccountBalanceSharpIcon />,
        disabled: true,
    },
    {
        path: '/borrow',
        key: 'Borrow',
        icon: <PriceCheckSharpIcon />,
        disabled: true,
    },
    {
        path: '/redeem',
        key: 'Redeem',
        icon: <SelfImprovementSharpIcon />,
        disabled: true,
    },
];

function NavContent() {
    const { t } = useTranslation();

    const address = useSignerAddress();
    const signerConnected = useSignerConnected();
    const bonds = useSelector(selectMostProfitableBonds);
    const bondInstances = useSelector(selectBondInstances);
    const { ensName } = useENS();

    const addresses = getAddresses(DEFAULT_NETWORK);
    const BASH_ADDRESS = addresses.BASH_ADDRESS;
    const DAI_ADDRESS = addresses.DAI_ADDRESS;

    const menuItems = useMemo(
        () => getMenuItems(signerConnected).map(({ path, key, ...props }) => <ListItemLink key={key} to={path} primary={t(key)} {...props} />),
        [signerConnected],
    );
    const comingSoonItems = cominSoonMenu.map(({ path, key, ...props }) => <ListItemLink key={key} to={path} primary={t(key)} {...props} />);

    const bondItems = bondInstances
        .filter(bond => bond.bondOptions.isActive)
        .map(({ ID, bondOptions: { displayName } }, index) => {
            const bondDiscount = bonds[index].bondDiscount;

            const discount = bondDiscount ? bondDiscount.mul(100).toNumber() : 0;

            return {
                ID,
                displayName,
                discount,
            };
        })
        .sort((bond1, bond2) => (bond1.discount < bond2.discount ? 1 : -1))
        .map(({ ID, displayName, discount }) => (
            <ListItemLink
                key={`mint-bond-${ID}`}
                to={`/bond/${ID}`}
                primary={displayName}
                extra={
                    <Typography paddingLeft={theme.spacing(2)} variant="body2">
                        {discount.toFixed(2)} %
                    </Typography>
                }
            />
        ));

    return (
        <Box
            sx={{
                padding: '2rem',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '10rem',
                overflowY: 'hidden',
                backgroundColor: theme.palette.cardBackground.light,
                backdropFilter: 'blur(100px)',
                color: theme.palette.primary.main,
                height: '100%',
            }}
        >
            <Box
                sx={{
                    flexDirection: 'column',
                    padding: '1rem',
                    width: '100%',
                }}
            >
                <Link href="https://atbash.finance" target="_blank">
                    <Avatar alt="Atbash" src={AtbashICON} sx={{ width: 128, height: 128, textAlign: 'center' }} />
                </Link>

                {address && (
                    <Box
                        sx={{
                            display: 'inline-flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: theme.spacing(2),

                            width: '100%',
                        }}
                    >
                        {/* <Davatar size={20} address={address} generatedAvatarType="jazzicon" /> */}
                        <Link href={`https://etherscan.io/address/${address}`} target="_blank">
                            <Typography sx={{ ml: 1 }} variant="body1">
                                {ensName || shorten(address)}
                            </Typography>
                        </Link>
                    </Box>
                )}
            </Box>

            <Box sx={{ marginTop: theme.spacing(1), marginBottom: theme.spacing(4) }}>
                <div>
                    <List
                        sx={{
                            color: theme.palette.primary.main,
                            '& .MuiListItemButton-root:hover': {
                                textDecoration: 'underline',
                            },
                        }}
                    >
                        {menuItems}
                        <Divider />
                        <Box pt={theme.spacing(2)}>
                            <Typography variant="body2"> {t('common:MintingDiscounts')}</Typography>

                            {bondItems}
                        </Box>

                        <Divider />
                        <ListItemLink to={getBuyLink(BASH_ADDRESS, DAI_ADDRESS)} primary={t('Buy')} renderComponent={Link} icon={<StorefrontIcon />} />
                        {comingSoonItems}
                    </List>
                </div>
            </Box>

            <Social />
        </Box>
    );
}

export default NavContent;
