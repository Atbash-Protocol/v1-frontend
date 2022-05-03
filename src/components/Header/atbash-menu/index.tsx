import React, { useState } from 'react';

import { Box, Button, Divider, Link, Fade, Popper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import BASH_IMG from 'assets/tokens/bash.png';
import SBASH_IMG from 'assets/tokens/sBASH.png';
import { theme } from 'constants/theme';
import { useWeb3Context } from 'contexts/web3/web3.context';
import { useSignerConnected } from 'contexts/web3/web3.hooks';
import { getBuyLink } from 'lib/uniswap/link';

import { getAddresses, TOKEN_DECIMALS } from '../../../constants';

const addTokenToWallet = (tokenSymbol: string, tokenAddress: string, tokenImagePath: string) => async () => {
    if (window.ethereum) {
        await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20',
                options: {
                    address: tokenAddress,
                    symbol: tokenSymbol,
                    decimals: TOKEN_DECIMALS,
                    image: [window.location.origin, tokenImagePath].join('/'),
                },
            },
        });
    }
};

function AtbashMenu() {
    const { t } = useTranslation();

    const isUserSigned = useSignerConnected();
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);

    const {
        state: { networkID },
    } = useWeb3Context();

    if (!networkID) return null;

    const addresses = getAddresses(networkID);

    const SBASH_ADDRESS = addresses.SBASH_ADDRESS;
    const BASH_ADDRESS = addresses.BASH_ADDRESS;
    const DAI_ADDRESS = addresses.DAI_ADDRESS;

    const handleClick = (event: React.MouseEvent) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'menu-popover' : undefined;

    return (
        <Box mr={1} onClick={e => handleClick(e)}>
            <Button sx={{ padding: theme.spacing(1) }} aria-describedby={id}>
                <Typography>
                    <>{t('BuyBASH')}</>
                </Typography>
            </Button>

            <Popper id={id} open={open} anchorEl={anchorEl} transition>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={200}>
                        <Box sx={{ background: theme.palette.cardBackground.light, padding: theme.spacing(2) }}>
                            <Link href={getBuyLink(DAI_ADDRESS, BASH_ADDRESS)} component={Typography} target="_blank">
                                <>{t('BuyOnUniswap')}</>
                            </Link>

                            {isUserSigned && (
                                <Box sx={{ color: theme.palette.primary.light }}>
                                    <Typography>
                                        <>{t('AddTokenToWallet')}</>
                                    </Typography>
                                    <Divider />
                                    <Typography sx={{ cursor: 'pointer' }} onClick={addTokenToWallet('BASH', BASH_ADDRESS, BASH_IMG)}>
                                        ↑ BASH
                                    </Typography>
                                    <Typography sx={{ cursor: 'pointer' }} onClick={() => addTokenToWallet('sBASH', SBASH_ADDRESS, SBASH_IMG)}>
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
