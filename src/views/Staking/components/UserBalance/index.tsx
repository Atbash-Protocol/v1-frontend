import { Box, Grid, Typography } from "@mui/material";
import { GlobalStyles } from "@mui/styled-engine";
import { theme } from "constants/theme";
import { formatNumber, formatUSD } from "helpers/price-units";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { shallowEqual, useSelector } from "react-redux";
import { AccountSlice } from "store/modules/account/account.types";
import { IAppSlice } from "store/slices/app-slice";
import { IReduxState } from "store/slices/state.interface";

interface UserBalanceProps {
    stakingAPY: number;
    stakingRebase: number;
    daiPrice: number;
    balances: AccountSlice["balances"];
    currentIndex: number;
}

const UserBalance = ({ stakingAPY, stakingRebase, balances, currentIndex }: UserBalanceProps) => {
    const { t } = useTranslation();

    const daiPrice = useSelector<IReduxState, number>(state => state.markets.markets.dai || 0);

    const totalBalance = _.sum([balances.BASH, balances.SBASH, balances.WSBASH].map(balance => balance.toNumber())) * daiPrice;

    const nextRewardValue = stakingRebase * balances.SBASH.toNumber();
    const wrappedTokenEquivalent = balances.SBASH.toNumber() * Number(currentIndex);
    const effectiveNextRewardValue = (nextRewardValue + stakingRebase) * wrappedTokenEquivalent * daiPrice;

    const userBalances = [
        {
            key: "stake:ValueOfYourBASH",
            value: formatUSD(balances.BASH.toNumber() * daiPrice),
        },
        {
            key: "stake:ValueOfYourStakedBASH",
            value: formatUSD(balances.WSBASH.toNumber() * daiPrice),
        },
        {
            key: "stake:ValueOfYourNextRewardAmount",
            value: formatUSD(balances.SBASH.toNumber() * stakingAPY),
        },
        {
            key: "stake:ValueOfYourEffectiveNextRewardAmount",
            value: formatNumber(effectiveNextRewardValue, 2),
        },
        {
            key: "stake:ValueOfYourWrappedStakedSB",
            value: formatNumber(balances.SBASH.toNumber() * daiPrice * Number(currentIndex)),
        },
    ];

    const balanceItems = userBalances.map(({ key, value }) => (
        <Box key={key} sx={{ display: "inline-flex", width: "100%", justifyContent: "space-between" }}>
            <Typography> {t(key)} </Typography>
            <Typography>
                <>{value}</>
            </Typography>
        </Box>
    ));

    return (
        <>
            <Box sx={{ display: "inline-flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h4"> {t("YourBalance")} </Typography>
                <Typography>
                    <>{formatUSD(totalBalance, 2)}</>
                </Typography>
            </Box>

            {balanceItems}
        </>
    );
};

export default UserBalance;
