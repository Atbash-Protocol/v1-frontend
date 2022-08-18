import { NavLink } from 'react-router-dom';
import Social from '../Social';
import StakeIcon from 'assets/icons/stake.svg';
import BondIcon from 'assets/icons/bond.svg';
import BuyIcon from 'assets/icons/buy.svg';
import BorrowIcon from 'assets/icons/House.svg';
import Forecast from 'assets/icons/chart.svg';
import GovIcon from 'assets/icons/governance.svg';
import WrapIcon from 'assets/icons/borrow.svg';

import AtbashICON from 'assets/icons/bash.svg';
import DashboardIcon from 'assets/icons/dashboard.svg';
import { trim, shorten } from 'helpers';
import { useAddress } from 'hooks';
import useBonds from 'hooks/bonds';
import { Link } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import './styles.scss';
import useENS from 'hooks/useENS';
import Davatar from '@davatar/react';

import { useTranslation } from 'react-i18next';
import { getAddressesAsync, IAddresses } from 'constants/addresses';
import { DEFAULT_NETWORK, Networks } from 'constants/blockchain';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { IReduxState } from 'store/slices/state.interface';

function NavContent() {
    const { t } = useTranslation();

    const address = useAddress();
    const { bonds } = useBonds();
    const { ensName } = useENS(address);
    const [chainArgument, setChainArgument] = useState('');

    const networkID = useSelector<IReduxState, number>(state => {
        return (state.app && state.app.networkID) || DEFAULT_NETWORK;
    });

    // const addresses = getAddresses(DEFAULT_NETWORK);
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
        const addresses = await getAddressesAsync(DEFAULT_NETWORK);
        setAddresses(addresses);
        if (networkID == Networks.RINKEBY) setChainArgument('&chain=rinkeby');
    };
    useEffect(() => {
        loadAddresses();
    }, [networkID]);

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
                            <p>{t('Dashboard')}</p>
                        </div>
                    </Link>

                    <Link component={NavLink} to="/stake" className="button-dapp-menu">
                        <div className="dapp-menu-item">
                            <img alt="" src={StakeIcon} />
                            <p>{t('Stake')}</p>
                        </div>
                    </Link>

                    <Link component={NavLink} id="wrap-nav" to="/wrap" className="button-dapp-menu">
                        <div className="dapp-menu-item">
                            <img alt="" src={WrapIcon} />

                            <p>{t('Wrap')}</p>
                        </div>
                    </Link>

                    <Link component={NavLink} id="bond-nav" to="/mints" className="button-dapp-menu">
                        <div className="dapp-menu-item">
                            <img alt="" src={BondIcon} />
                            <p>{t('Minting')}</p>
                        </div>
                    </Link>

                    <div className="bond-discounts">
                        <p className="bond-discounts-title">{t('MintingDiscounts')}</p>
                        {bonds
                            .filter(bond => bond.isActive)
                            .map((bond, i) => (
                                <Link component={NavLink} to={`/mints/${bond.name}`} key={i} className={'bond'}>
                                    {!bond.bondDiscount ? (
                                        <Skeleton variant="text" width={'150px'} />
                                    ) : (
                                        <p>
                                            {bond.displayName}
                                            <span className="bond-pair-roi">{bond.bondDiscount && trim(bond.bondDiscount * 100, 2)}%</span>
                                        </p>
                                    )}
                                </Link>
                            ))}
                    </div>

                    <Link href={`https://app.uniswap.org/#/swap?inputCurrency=${DAI_ADDRESS}&outputCurrency=${BASH_ADDRESS}${chainArgument}`} target="_blank">
                        <div className="button-dapp-menu">
                            <div className="dapp-menu-item">
                                <img alt="" src={BuyIcon} />
                                <p>{t('Buy')}</p>
                            </div>
                        </div>
                    </Link>

                    <Link component={NavLink} to="/Forecast" className="button-dapp-menu">
                        <div className="button-dapp-menu">
                            <div className="dapp-menu-item">
                                <img alt="" src={Forecast} />
                                <p>{t('Forecast')}</p>
                            </div>
                        </div>
                    </Link>

                    <Link href={`https://forms.gle/kC1VCPQ21BUa2ZWy5`} target="_blank">
                        <div className="button-dapp-menu">
                            <div className="dapp-menu-item">
                                <img alt="" src={BorrowIcon} />
                                <p>{t('Housing Grants')}</p>
                            </div>
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
                            <p>{t('Governance')}</p>
                        </div>
                    </Link>
                </div>
            </div>

            <Social />
        </div>
    );
}

export default NavContent;
