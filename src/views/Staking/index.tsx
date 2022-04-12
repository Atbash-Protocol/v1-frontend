import { useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { Zoom } from "@material-ui/core";
import RebaseTimer from "../../components/RebaseTimer";
import "./stake.scss";
import { useWeb3Context } from "../../hooks";
import { IReduxState } from "../../store/slices/state.interface";
import Loading from "components/Loader";

import { useTranslation } from "react-i18next";
import Stake from "./components/Stake";
import StakeMetrics from "./components/Metrics";
import { MainSliceState } from "store/modules/app/app.types";
import { calculateStakingRewards } from "store/modules/app/app.helpers";
import { loadBalancesAndAllowances } from "store/modules/account/account.thunks";
import { AccountSlice } from "store/modules/account/account.types";
import UserStakeMetrics from "./components/Stake/StakeMetrics";
import { Box, Grid, styled, Typography } from "@mui/material";
import { theme } from "constants/theme";

import { selectStakingRewards, selectTVL } from "store/modules/metrics/metrics.selectors";
import UserBalance from "./components/UserBalance";

function Staking() {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const { provider, address, chainID } = useWeb3Context();

    const daiPrice = useSelector<IReduxState, number | null>(state => state.markets.markets.dai);
    const { loading: stakingLoading, balances } = useSelector<IReduxState, AccountSlice>(state => state.accountNew, shallowEqual);

    const { epoch, index: stakingIndex } = useSelector<IReduxState, MainSliceState["staking"]>(state => state.main.staking, shallowEqual);

    const stakingMetrics = useSelector(selectStakingRewards);
    const TVL = useSelector(selectTVL);

    useEffect(() => {
        dispatch(loadBalancesAndAllowances({ address, chainID, provider }));
    }, []);

    if (!stakingMetrics || !TVL) return <Loading />;

    return (
        <Box
            sx={{
                padding: theme.spacing(4),
                marginRight: theme.spacing(4),
            }}
        >
            <Zoom in={true}>
                <Box
                    sx={{
                        backgroundColor: theme.palette.cardBackground.main,
                        backdropFilter: "blur(100px)",
                        borderRadius: ".5rem",
                        color: theme.palette.secondary.main,
                        p: 4,
                    }}
                >
                    <Box sx={{ color: theme.palette.secondary.main }}>
                        <Typography variant="h4" sx={{ textTransform: "uppercase" }}>
                            {t("stake:StakeTitle")}
                        </Typography>
                        <RebaseTimer />
                    </Box>

                    <Box sx={{ marginTop: theme.spacing(4) }}>
                        <StakeMetrics TVL={TVL} APY={stakingMetrics.stakingAPY || 0} currentIndex={stakingIndex!} BASHPrice={daiPrice!} />
                    </Box>
                    <Box sx={{ marginTop: theme.spacing(4) }}>
                        <Stake />
                    </Box>
                    <Box sx={{ marginTop: theme.spacing(4) }}>
                        <UserStakeMetrics />
                    </Box>
                </Box>
            </Zoom>

            <Zoom in={true}>
                <Box
                    sx={{
                        backgroundColor: theme.palette.cardBackground.main,
                        marginTop: 4,
                        backdropFilter: "blur(100px)",
                        borderRadius: ".5rem",
                        color: theme.palette.secondary.main,
                        p: 4,
                    }}
                >
                    <UserBalance
                        stakingAPY={stakingMetrics.stakingAPY!}
                        stakingRebase={stakingMetrics.stakingRebase!}
                        daiPrice={daiPrice!}
                        balances={balances}
                        currentIndex={stakingIndex!}
                    />
                </Box>
            </Zoom>
        </Box>
    );
}

export default Staking;
