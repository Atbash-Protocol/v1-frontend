import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, InputAdornment, OutlinedInput, Zoom } from '@material-ui/core';
import RebaseTimer from '../../components/RebaseTimer';
import { formatUSD, trim } from '../../helpers';
import { changeStake, changeApproval } from '../../store/slices/stake-thunk';
import './stake.scss';
import { useWeb3Context } from '../../hooks';
import { IPendingTxn, isPendingTxn, txnButtonText } from '../../store/slices/pending-txns-slice';
import { Skeleton } from '@material-ui/lab';
import { IReduxState } from '../../store/slices/state.interface';
import { messages } from '../../constants/messages';
import classnames from 'classnames';
import { warning } from '../../store/slices/messages-slice';
import { IAppSlice } from '../../store/slices/app-slice';

import { useTranslation } from 'react-i18next';

function Stake() {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const { provider, address, connect, chainID, checkWrongNetwork } = useWeb3Context();
    const app = useSelector<IReduxState, IAppSlice>(state => state.app);

    const [view, setView] = useState(0);
    const [quantity, setQuantity] = useState<string>('');

    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const currentIndex = useSelector<IReduxState, string>(state => {
        return state.app.currentIndex;
    });
    const fiveDayRate = useSelector<IReduxState, number>(state => {
        return state.app.fiveDayRate;
    });
    const BASHbalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.BASH;
    });
    const sBASHBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.sBASH;
    });
    const wsBASHBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.wsBASH;
    });
    const stakeAllowance = useSelector<IReduxState, number>(state => {
        return state.account.staking && state.account.staking.BASH;
    });
    const unstakeAllowance = useSelector<IReduxState, number>(state => {
        return state.account.staking && state.account.staking.sBASH;
    });
    const stakingRebase = useSelector<IReduxState, number>(state => {
        return state.app.stakingRebase;
    });
    const stakingAPY = useSelector<IReduxState, number>(state => {
        return state.app.stakingAPY;
    });
    const stakingTVL = useSelector<IReduxState, number>(state => {
        return state.app.stakingTVL;
    });

    const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    const setMax = () => {
        if (view === 0) {
            setQuantity(BASHbalance);
        } else {
            setQuantity(sBASHBalance);
        }
    };

    const onSeekApproval = async (token: string) => {
        if (await checkWrongNetwork()) return;

        await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
    };

    const onChangeStake = async (action: string) => {
        if (await checkWrongNetwork()) return;
        if (quantity === '' || parseFloat(quantity) === 0) {
            dispatch(warning({ text: action === 'stake' ? messages.before_stake : messages.before_unstake }));
        } else {
            await dispatch(changeStake({ address, action, value: String(quantity), provider, networkID: chainID }));
            setQuantity('');
        }
    };

    const hasAllowance = useCallback(
        token => {
            if (token === 'BASH') return stakeAllowance > 0;
            if (token === 'sBASH') return unstakeAllowance > 0;
            return 0;
        },
        [stakeAllowance, unstakeAllowance],
    );

    const changeView = (newView: number) => () => {
        setView(newView);
        setQuantity('');
    };

    const trimmedsBASHBalance = trim(Number(sBASHBalance), 6);
    const trimmedWrappedStakedSBBalance = trim(Number(wsBASHBalance), 6);
    const formattedAPY = trim(stakingAPY * 100, 1);
    const trimmedStakingAPY = formattedAPY.length > 16 ? '> 1,000,000' : formattedAPY;
    const stakingRebasePercentage = trim(stakingRebase * 100, 4);
    const nextRewardValue = trim((Number(stakingRebasePercentage) / 100) * Number(trimmedsBASHBalance), 6);
    const wrappedTokenEquivalent = trim(Number(trimmedWrappedStakedSBBalance) * Number(currentIndex), 6);
    const effectiveNextRewardValue = trim(Number(Number(nextRewardValue) + (Number(stakingRebasePercentage) / 100) * Number(wrappedTokenEquivalent)), 6);

    const valueOfSB = formatUSD(Number(BASHbalance) * app.marketPrice);
    const valueOfStakedBalance = formatUSD(Number(trimmedsBASHBalance) * app.marketPrice);
    const valueOfWrappedStakedBalance = formatUSD(Number(trimmedWrappedStakedSBBalance) * Number(currentIndex) * app.marketPrice);
    const sumOfAllBalance = Number(BASHbalance) + Number(trimmedsBASHBalance) + Number(trimmedWrappedStakedSBBalance) * Number(currentIndex);
    const valueOfAllBalance = formatUSD(sumOfAllBalance * app.marketPrice);
    const valueOfYourNextRewardAmount = formatUSD(Number(nextRewardValue) * app.marketPrice);
    const valueOfYourEffectiveNextRewardAmount = formatUSD(Number(effectiveNextRewardValue) * app.marketPrice);

    return (
        <div className="stake-view">
            <Zoom in={true}>
                <div className="stake-card">
                    <Grid className="stake-card-grid" container direction="column" spacing={2}>
                        <Grid item>
                            <div className="stake-card-header">
                                <p className="stake-card-header-title">{t('stake:StakeTitle')}</p>
                                <RebaseTimer />
                            </div>
                        </Grid>

                        <Grid item>
                            <div className="stake-card-metrics">
                                <Grid container spacing={2}>
                                    <Grid item xs={6} sm={3} md={3} lg={3}>
                                        <div className="stake-card-apy">
                                            <p className="stake-card-metrics-title">{t('APY')}</p>
                                            <p className="stake-card-metrics-value">{stakingAPY ? <>{trimmedStakingAPY}%</> : <Skeleton width="150px" />}</p>
                                        </div>
                                    </Grid>

                                    <Grid item xs={6} sm={3} md={3} lg={3}>
                                        <div className="stake-card-tvl">
                                            <p className="stake-card-metrics-title">{t('TVL')}</p>
                                            <p className="stake-card-metrics-value">
                                                {stakingTVL ? (
                                                    new Intl.NumberFormat('en-US', {
                                                        style: 'currency',
                                                        currency: 'USD',
                                                        maximumFractionDigits: 0,
                                                        minimumFractionDigits: 0,
                                                    }).format(stakingTVL)
                                                ) : (
                                                    <Skeleton width="150px" />
                                                )}
                                            </p>
                                        </div>
                                    </Grid>

                                    <Grid item xs={6} sm={3} md={3} lg={3}>
                                        <div className="stake-card-index">
                                            <p className="stake-card-metrics-title">{t('CurrentIndex')}</p>
                                            <p className="stake-card-metrics-value">{currentIndex ? <>{trim(Number(currentIndex), 2)} BASH</> : <Skeleton width="150px" />}</p>
                                        </div>
                                    </Grid>

                                    <Grid item xs={6} sm={3} md={3} lg={3}>
                                        <div className="stake-card-index">
                                            <p className="stake-card-metrics-title">{t('BASHPrice')}</p>
                                            <p className="stake-card-metrics-value">{isAppLoading ? <Skeleton width="100px" /> : `$${trim(app.marketPrice, 2)}`}</p>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>

                        <div className="stake-card-area">
                            {!address && (
                                <div className="stake-card-wallet-notification">
                                    <div className="stake-card-wallet-connect-btn" onClick={connect}>
                                        <p>{t('ConnectWallet')}</p>
                                    </div>
                                    <p className="stake-card-wallet-desc-text">{t('stake:ConnectYourWalletToStake')}</p>
                                </div>
                            )}
                            {address && (
                                <>
                                    <div className="stake-card-action-area">
                                        <div className="stake-card-action-stage-btns-wrap">
                                            <div onClick={changeView(0)} className={classnames('stake-card-action-stage-btn', { active: !view })}>
                                                <p>{t('stake:Stake')}</p>
                                            </div>
                                            <div onClick={changeView(1)} className={classnames('stake-card-action-stage-btn', { active: view })}>
                                                <p>{t('stake:Unstake')}</p>
                                            </div>
                                        </div>

                                        <div className="stake-card-action-row">
                                            <OutlinedInput
                                                type="number"
                                                placeholder={t('Amount')}
                                                className="stake-card-action-input"
                                                value={quantity}
                                                onChange={e => setQuantity(e.target.value)}
                                                labelWidth={0}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <div onClick={setMax} className="stake-card-action-input-btn">
                                                            <p>{t('Max')}</p>
                                                        </div>
                                                    </InputAdornment>
                                                }
                                            />

                                            {view === 0 && (
                                                <div className="stake-card-tab-panel">
                                                    {address && hasAllowance('BASH') ? (
                                                        <div
                                                            className="stake-card-tab-panel-btn"
                                                            onClick={() => {
                                                                if (isPendingTxn(pendingTransactions, 'staking')) return;
                                                                onChangeStake('stake');
                                                            }}
                                                        >
                                                            <p>{txnButtonText(pendingTransactions, 'staking', t('Stake BASH'))}</p>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="stake-card-tab-panel-btn"
                                                            onClick={() => {
                                                                if (isPendingTxn(pendingTransactions, 'approve_staking')) return;
                                                                onSeekApproval('BASH');
                                                            }}
                                                        >
                                                            <p>{txnButtonText(pendingTransactions, 'approve_staking', t('Approve'))}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {view === 1 && (
                                                <div className="stake-card-tab-panel">
                                                    {address && hasAllowance('sBASH') ? (
                                                        <div
                                                            className="stake-card-tab-panel-btn"
                                                            onClick={() => {
                                                                if (isPendingTxn(pendingTransactions, 'unstaking')) return;
                                                                onChangeStake('unstake');
                                                            }}
                                                        >
                                                            <p>{txnButtonText(pendingTransactions, 'unstaking', t('Unstake BASH'))}</p>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="stake-card-tab-panel-btn"
                                                            onClick={() => {
                                                                if (isPendingTxn(pendingTransactions, 'approve_unstaking')) return;
                                                                onSeekApproval('sBASH');
                                                            }}
                                                        >
                                                            <p>{txnButtonText(pendingTransactions, 'approve_unstaking', t('Approve'))}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="stake-card-action-help-text">
                                            {address && ((!hasAllowance('BASH') && view === 0) || (!hasAllowance('sBASH') && view === 1)) && <p>{t('stake:ApproveNote')}</p>}
                                        </div>
                                    </div>

                                    <div className="stake-user-data">
                                        <div className="data-row">
                                            <p className="data-row-name">{t('YourBalance')}</p>
                                            <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(BASHbalance), 4)} BASH</>}</p>
                                        </div>

                                        <div className="data-row">
                                            <p className="data-row-name">{t('stake:YourStakedBalance')}</p>
                                            <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trimmedsBASHBalance} sBASH</>}</p>
                                        </div>

                                        {Number(trimmedWrappedStakedSBBalance) > 0 && (
                                            <div className="data-row">
                                                <p className="data-row-name">{t('stake:YourWrappedStakedBalance')}</p>
                                                <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trimmedWrappedStakedSBBalance} wsBASH</>}</p>
                                            </div>
                                        )}

                                        {Number(trimmedWrappedStakedSBBalance) > 0 && (
                                            <div className="data-row">
                                                <p className="data-row-name">{t('stake:WrappedTokenEquivalent')}</p>
                                                <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>({wrappedTokenEquivalent} sBASH)</>}</p>
                                            </div>
                                        )}
                                        <div className="data-row">
                                            <p className="data-row-name">{t('stake:NextRewardAmount')}</p>
                                            <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{nextRewardValue} BASH</>}</p>
                                        </div>

                                        {Number(trimmedWrappedStakedSBBalance) > 0 && (
                                            <div className="data-row">
                                                <p className="data-row-name">{t('stake:EffectiveNextRewardAmount')}</p>
                                                <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{effectiveNextRewardValue} BASH</>}</p>
                                            </div>
                                        )}

                                        <div className="data-row">
                                            <p className="data-row-name">{t('stake:NextRewardYield')}</p>
                                            <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{stakingRebasePercentage}%</>}</p>
                                        </div>

                                        <div className="data-row">
                                            <p className="data-row-name">{t('stake:ROIFiveDayRate')}</p>
                                            <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(fiveDayRate) * 100, 4)}%</>}</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </Grid>
                </div>
            </Zoom>
            {address && (
                <Zoom in={true}>
                    <div className="stake-card">
                        <Grid className="stake-card-grid" container direction="column">
                            <Grid item>
                                <div className="stake-card-header data-row">
                                    <p className="stake-card-header-title">{t('YourBalance')}</p>
                                    <p className="stake-card-header-title">{isAppLoading ? <Skeleton width="80px" /> : <>{valueOfAllBalance}</>}</p>
                                </div>
                            </Grid>

                            <div className="stake-card-area">
                                <>
                                    <div className="data-row">
                                        <p className="data-row-name">{t('stake:ValueOfYourBASH')}</p>
                                        <p className="data-row-value"> {isAppLoading ? <Skeleton width="80px" /> : <>{valueOfSB}</>}</p>
                                    </div>

                                    <div className="data-row">
                                        <p className="data-row-name">{t('stake:ValueOfYourStakedBASH')}</p>
                                        <p className="data-row-value"> {isAppLoading ? <Skeleton width="80px" /> : <>{valueOfStakedBalance}</>}</p>
                                    </div>

                                    <div className="data-row">
                                        <p className="data-row-name">{t('stake:ValueOfYourNextRewardAmount')}</p>
                                        <p className="data-row-value"> {isAppLoading ? <Skeleton width="80px" /> : <>{valueOfYourNextRewardAmount}</>}</p>
                                    </div>

                                    <div className="data-row">
                                        <p className="data-row-name">{t('stake:ValueOfYourEffectiveNextRewardAmount')}</p>
                                        <p className="data-row-value"> {isAppLoading ? <Skeleton width="80px" /> : <>{valueOfYourEffectiveNextRewardAmount}</>}</p>
                                    </div>

                                    {Number(trimmedWrappedStakedSBBalance) > 0 && (
                                        <div className="data-row">
                                            <p className="data-row-name">{t('stake:ValueOfYourWrappedStakedSB')}</p>
                                            <p className="data-row-value"> {isAppLoading ? <Skeleton width="80px" /> : <>{valueOfWrappedStakedBalance}</>}</p>
                                        </div>
                                    )}
                                </>
                            </div>
                        </Grid>
                    </div>
                </Zoom>
            )}
        </div>
    );
}

export default Stake;
