import { useState } from "react";
import { useSelector } from "react-redux";
import { Box, Grid, InputAdornment, OutlinedInput, Zoom } from "@material-ui/core";
import Slider from "@mui/material/Slider";
import { trim } from "../../helpers";
import "./Forecast.scss";
import { useWeb3Context } from "../../hooks";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { fCurrency, fShortenNumber } from "../../helpers/formatNumers";

import { IAppSlice } from "../../store/slices/app-slice";

import { useTranslation } from "react-i18next";

function Stake() {
    const { t } = useTranslation();

    const { address, connect } = useWeb3Context();

    const [sBASHQuantity, setsBASHQuantity] = useState<string>("1");
    const [rewardYield, setRewardYield] = useState<string>("1.5");
    const [price, setPrice] = useState<string>("1200");
    const [futurePrice, setFuturePrice] = useState<string>("10000");
    const [duration, setDuration] = useState<number>(30);

    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const sBASHBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.sBASH;
    });
    const stakingRebase = useSelector<IReduxState, number>(state => {
        return state.app.stakingRebase;
    });

    const app = useSelector<IReduxState, IAppSlice>(state => state.app);

    const setsBASHToMax = () => {
        setsBASHQuantity(sBASHBalance);
    };

    const trimmedsBASHBalance = trim(Number(sBASHBalance), 6);
    const stakingRebasePercentage = trim(stakingRebase * 100, 4);

    const setYeildCurrent = () => {
        setRewardYield(stakingRebasePercentage);
    };
    const setCurrentPrice = () => {
        setPrice(trim(app.marketPrice, 2));
    };
    const setCurrentPriceToFuture = () => {
        setFuturePrice(trim(app.marketPrice, 2));
    };

    function preventHorizontalKeyboardNavigation(event: React.KeyboardEvent) {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
        }
    }
    const handleSliderChange = (event: Event, newValue: number) => {
        setDuration(newValue);
    };

    // Forecast calc
    const epochs_per_day = 3;

    const roi_day = (1 + parseFloat(rewardYield) / 100) ** (duration * epochs_per_day) - 1;
    const gains = parseFloat(sBASHQuantity) * roi_day;
    const lamboPrice = 222004;

    const currentWealth = parseFloat(sBASHQuantity) * app?.marketPrice;
    const futureWealth = (parseFloat(sBASHQuantity) + gains) * parseFloat(futurePrice);
    const nbLambo = Math.round(futureWealth / lamboPrice);
    const investment = parseFloat(price) * parseFloat(sBASHQuantity);

    return (
        <div className="stake-view">
            <Zoom in={true}>
                <div className="Forecast-card">
                    <Grid className="Forecast-card-grid" container direction="column" spacing={2}>
                        <Grid item>
                            <div className="Forecast-card-header">
                                <p className="Forecast-card-header-title">{t("globe:ForecastTitle")}</p>
                                <p className="Forecast-card-header-subtitle">{t("globe:EstimateYourReturns")}</p>
                                <p className="Forecast-card-header-disclaimer">{t("globe:ForecastWarning")}</p>
                            </div>
                        </Grid>

                        <Grid item>
                            <div className="Forecast-card-metrics">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                        <div className="Forecast-card-apy">
                                            <p className="Forecast-card-metrics-title">{t("globe:CurrentBASHPrice")}</p>
                                            <p className="Forecast-card-metrics-value">{isAppLoading ? <Skeleton width="100px" /> : `$${trim(app.marketPrice, 2)}`}</p>
                                        </div>
                                    </Grid>

                                    <Grid item xs={6} sm={4} md={4} lg={4}>
                                        <div className="Forecast-card-tvl">
                                            <p className="Forecast-card-metrics-title">{t("globe:CurrentRewardYield")}</p>
                                            <p className="Forecast-card-metrics-value">{isAppLoading ? <Skeleton width="80px" /> : <>{stakingRebasePercentage}%</>}</p>
                                        </div>
                                    </Grid>

                                    <Grid item xs={6} sm={4} md={4} lg={4}>
                                        <div className="Forecast-card-index">
                                            <p className="Forecast-card-metrics-title">{t("globe:YourStakedBASHBalance")}</p>
                                            <p className="Forecast-card-metrics-value">{isAppLoading ? <Skeleton width="150px" /> : <>{trimmedsBASHBalance} sBASH</>}</p>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>

                        <div className="Forecast-card-area">
                            {!address && (
                                <div className="Forecast-card-wallet-notification">
                                    <div className="Forecast-card-wallet-connect-btn" onClick={connect}>
                                        <p>{t("ConnectWallet")}</p>
                                    </div>
                                    <p className="Forecast-card-wallet-desc-text">{t("globe:ConnectYourWalletToUseForecast")}</p>
                                </div>
                            )}
                            {address && (
                                <div className="Forecast-card-action-area">
                                    <Grid className="Forecast-card-grid" container spacing={1}>
                                        <Grid item sm={5} className="Forecast-entry">
                                            <div className="Forecast-card-action-row">
                                                <p className="Forecast-card-action-label">{t("globe:StakedSBAmount")}</p>
                                                <OutlinedInput
                                                    type="number"
                                                    placeholder={t("globe:EnterStakedSBAmount")}
                                                    className="Forecast-card-action-input"
                                                    value={sBASHQuantity}
                                                    onChange={e => setsBASHQuantity(e.target.value)}
                                                    labelWidth={0}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <div onClick={setsBASHToMax} className="Forecast-card-action-input-btn">
                                                                <p>{t("Max")}</p>
                                                            </div>
                                                        </InputAdornment>
                                                    }
                                                />
                                            </div>
                                            <div className="Forecast-card-action-row">
                                                <p className="Forecast-card-action-label">{t("globe:RewardYieldPercent")}</p>
                                                <OutlinedInput
                                                    type="number"
                                                    placeholder={t("globe:EnterRewardYieldPercent")}
                                                    className="Forecast-card-action-input"
                                                    value={rewardYield}
                                                    onChange={e => setRewardYield(e.target.value)}
                                                    labelWidth={0}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <div onClick={setYeildCurrent} className="Forecast-card-action-input-btn">
                                                                <p>{t("globe:Current")}</p>
                                                            </div>
                                                        </InputAdornment>
                                                    }
                                                />
                                            </div>
                                            <div className="Forecast-card-action-row">
                                                <p className="Forecast-card-action-label">{t("globe:BASHPriceAtPurchase")}</p>
                                                <OutlinedInput
                                                    type="number"
                                                    placeholder={t("globe:EnterBuyPrice")}
                                                    className="Forecast-card-action-input"
                                                    value={price}
                                                    onChange={e => setPrice(e.target.value)}
                                                    labelWidth={0}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <div onClick={setCurrentPrice} className="Forecast-card-action-input-btn">
                                                                <p>{t("globe:Current")}</p>
                                                            </div>
                                                        </InputAdornment>
                                                    }
                                                />
                                            </div>
                                            <div className="Forecast-card-action-row">
                                                <p className="Forecast-card-action-label">{t("globe:FutureBASHMarketPrice")}</p>
                                                <OutlinedInput
                                                    type="number"
                                                    placeholder={t("globe:EnterFuturePrice")}
                                                    className="Forecast-card-action-input"
                                                    value={futurePrice}
                                                    onChange={e => setFuturePrice(e.target.value)}
                                                    labelWidth={0}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <div onClick={setCurrentPriceToFuture} className="Forecast-card-action-input-btn">
                                                                <p>{t("globe:Current")}</p>
                                                            </div>
                                                        </InputAdornment>
                                                    }
                                                />
                                            </div>
                                        </Grid>
                                        <Grid item className="slider-container">
                                            <Box className="slider-inner">
                                                <Box className="Forecast-days">
                                                    <p className="data-row-value">
                                                        {duration}
                                                        <br />
                                                        {t("day", { count: duration })}
                                                    </p>
                                                </Box>
                                                <Slider
                                                    sx={{
                                                        '& input[type="range"]': {
                                                            WebkitAppearance: "slider-vertical",
                                                        },
                                                        display: { xs: "none", sm: "block" },
                                                    }}
                                                    step={1}
                                                    marks
                                                    min={1}
                                                    max={365}
                                                    orientation="vertical"
                                                    value={duration}
                                                    //@ts-ignore
                                                    onChange={handleSliderChange}
                                                    aria-label={t("globe:Duration")}
                                                    onKeyDown={preventHorizontalKeyboardNavigation}
                                                />
                                                <Slider
                                                    sx={{
                                                        '& input[type="range"]': {
                                                            WebkitAppearance: "slider-horizontal",
                                                        },
                                                        display: { xs: "block", sm: "none" },
                                                        width: 1,
                                                    }}
                                                    step={1}
                                                    marks
                                                    min={1}
                                                    max={365}
                                                    orientation="horizontal"
                                                    value={duration}
                                                    //@ts-ignore
                                                    onChange={handleSliderChange}
                                                    aria-label={t("globe:Duration")}
                                                    onKeyDown={preventHorizontalKeyboardNavigation}
                                                />
                                            </Box>
                                        </Grid>

                                        <Grid item sm={5} className="Forecast-data">
                                            <div className="data-row">
                                                <p className="data-row-name">{t("globe:YourInitialInvestment")}</p>
                                                <p className="data-row-value">{fCurrency(investment)}</p>
                                            </div>
                                            <div className="data-row">
                                                <p className="data-row-name">{t("globe:CurrentWealth")}</p>
                                                <p className="data-row-value">{fCurrency(currentWealth)}</p>
                                            </div>
                                            <div className="data-row">
                                                <p className="data-row-name">{t("globe:BASHRewardsEstimation")}</p>
                                                <p className="data-row-value">{fShortenNumber(gains)} BASH</p>
                                            </div>
                                            <div className="data-row">
                                                <p className="data-row-name">{t("globe:PotentialReturn")}</p>
                                                <p className="data-row-value">{fCurrency(futureWealth)}</p>
                                            </div>
                                            <div className="data-row">
                                                <p className="data-row-name">
                                                    {t("globe:PotentialNumberLambo")}
                                                    <span>{t("globe:LamboHelpText")}</span>
                                                </p>
                                                <p className="data-row-value">{nbLambo}</p>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </div>
                            )}
                        </div>
                    </Grid>
                </div>
            </Zoom>
        </div>
    );
}

export default Stake;
