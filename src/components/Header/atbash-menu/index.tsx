import { useEffect, useState } from 'react';
import { TOKEN_DECIMALS, DEFAULT_NETWORK, getAddressesAsync, IAddresses, Networks } from '../../../constants';
import { useSelector } from 'react-redux';
import { Link, Fade, Popper } from '@material-ui/core';
import './atbash-menu.scss';
import { IReduxState } from '../../../store/slices/state.interface';
import { getTokenUrl } from '../../../helpers';

import { useTranslation } from 'react-i18next';

const addTokenToWallet = (tokenSymbol: string, tokenAddress: string) => async () => {
    const tokenImage = getTokenUrl(tokenSymbol.toLowerCase());

    if (window.ethereum) {
        try {
            await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
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
    const [chainArgument, setChainArgument] = useState('');

    const networkID = useSelector<IReduxState, number>(state => {
        return (state.app && state.app.networkID) || DEFAULT_NETWORK;
    });

    const initialState: IAddresses = {
        BASH_ADDRESS: '',
        BASH_BONDING_CALC_ADDRESS: '',
        BASH_DAI_BOND_ADDRESS: '',
        BASH_DAI_LP_ADDRESS: '',
        DAI_ADDRESS: '',
        DAI_BOND_ADDRESS: '',
        DAO_ADDRESS: '',
        REDEEM_ADDRESS: '',
        SBASH_ADDRESS: '',
        STAKING_ADDRESS: '',
        STAKING_HELPER_ADDRESS: '',
        TREASURY_ADDRESS: '',
        WSBASH_ADDRESS: '',
        ABASH_ADDRESS: '',
        PRESALE_ADDRESS: '',
        PRESALE_REDEMPTION_ADDRESS: '',
    };
    const [addresses, setAddresses] = useState<IAddresses>(initialState);
    const loadAddresses = async () => {
        const addresses = await getAddressesAsync(networkID);
        setAddresses(addresses);
        if (networkID == Networks.RINKEBY) setChainArgument('&chain=rinkeby');
    };
    useEffect(() => {
        loadAddresses();
    }, [networkID]);

    const handleClick = (event: any) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);

    return (
        <div className="bash-menu-root" onMouseEnter={e => handleClick(e)} onMouseLeave={e => handleClick(e)}>
            <div className="bash-menu-btn">
                <p>{t('BuyBASH')}</p>
            </div>

            <Popper className="bash-menu-popper" open={open} anchorEl={anchorEl} transition>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={200}>
                        <div className="tooltip">
                            <Link
                                className="tooltip-item"
                                href={`https://app.uniswap.org/#/swap?&inputCurrency=${addresses.DAI_ADDRESS}&outputCurrency=${addresses.BASH_ADDRESS}${chainArgument}`}
                                target="_blank"
                            >
                                <p>{t('BuyOnUniswap')}</p>
                            </Link>

                            {isEthereumAPIAvailable && (
                                <div className="add-tokens">
                                    <div className="divider" />
                                    <p className="add-tokens-title">{t('AddTokenToWallet')}</p>
                                    <div className="divider" />
                                    <div className="tooltip-item" onClick={addTokenToWallet('BASH', addresses.BASH_ADDRESS)}>
                                        <p>↑ BASH</p>
                                    </div>
                                    <div className="tooltip-item" onClick={addTokenToWallet('sBASH', addresses.SBASH_ADDRESS)}>
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
