import { Box, Grid, Skeleton, Typography } from "@mui/material";
import { theme } from "constants/theme";
import { formatNumber, formatUSD } from "helpers/price-units";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { shallowEqual, useSelector } from "react-redux";
import { IAccountSlice } from "store/account/account.types";
import { IAppSlice } from "store/slices/app-slice";
import { IReduxState } from "store/slices/state.interface";

type UserBlalanceProps = Pick<IAccountSlice, "balances" | "loading"> & Pick<IAppSlice, "marketPrice" | "currentIndex">;

const Item = ({ name, value }: { name: string; value: unknown }) => (
    <Box component="div" sx={{ display: "inline" }}>
        <Typography> {name} </Typography>
        <Typography>
            <>{value}</>
        </Typography>
    </Box>
);

export const UserBalance = () => {
    const { t } = useTranslation();

    const {
        balances: { BASH, sBASH, wsBASH },
        loading: accountLoading,
    } = useSelector<IReduxState, IAccountSlice>(state => state.account);
    const { currentIndex, marketPrice, loading: appLoading } = useSelector<IReduxState, IAppSlice>(state => state.app, shallowEqual);

    const totalBalance = _.sum([BASH, sBASH, wsBASH].map(Number));
    const trimmedsBASHBalance = formatNumber(Number(sBASH), 6);
    const trimmedWrappedStakedSBBalance = formatNumber(Number(wsBASH), 6);
    const valueOfSB = formatUSD(Number(BASH) * marketPrice);

    const userBalances = [
        {
            key: "stake:ValueOfYourBASH",
            value: formatUSD(Number(trimmedsBASHBalance) * marketPrice),
        },
        {
            key: "stake:ValueOfYourStakedBASH",
            value: formatUSD(_.reduce([Number(trimmedWrappedStakedSBBalance), Number(currentIndex), marketPrice], _.multiply, 1)),
        },
        {
            key: "stake:ValueOfYourNextRewardAmount",
            value: "",
        },
        {
            key: "stake:ValueOfYourEffectiveNextRewardAmount",
            value: "",
        },
        trimmedWrappedStakedSBBalance && {
            key: "stake:ValueOfYourBASH",
            value: "",
        },
    ];

    const balanceItems = Object.entries(userBalances).map(([balanceKey, value]) => (
        <Box key={balanceKey} sx={{ display: "inline-flex", width: "100%", justifyContent: "space-between" }}>
            <Typography> {balanceKey} </Typography>
            <Typography>
                <>{value}</>
            </Typography>
        </Box>
    ));

    return (
        <Grid
            direction="column"
            sx={{
                backgroundColor: theme.palette.cardBackground.main,
                backdropFilter: "blur(100px)",
                borderRadius: ".5rem",
                color: theme.palette.secondary.main,
                p: 4,
            }}
        >
            <Box sx={{ display: "inline-flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h2"> {t("YourBalance")} </Typography>
                <Typography> {accountLoading ? <Skeleton /> : <>{formatUSD(totalBalance, 2)}</>}</Typography>
            </Box>

            {/* {balanceItems} */}

            {/* <div className="stake-card-area">
                <>
                    <div className="data-row">
                        <p className="data-row-name">{t("stake:ValueOfYourBASH")}</p>
                        <p className="data-row-value"> {isAppLoading ? <Skeleton width="80px" /> : <>{valueOfSB}</>}</p>
                    </div>

                    <div className="data-row">
                        <p className="data-row-name">{t("stake:ValueOfYourStakedBASH")}</p>
                        <p className="data-row-value"> {isAppLoading ? <Skeleton width="80px" /> : <>{valueOfStakedBalance}</>}</p>
                    </div>

                    <div className="data-row">
                        <p className="data-row-name">{t("stake:ValueOfYourNextRewardAmount")}</p>
                        <p className="data-row-value"> {isAppLoading ? <Skeleton width="80px" /> : <>{valueOfYourNextRewardAmount}</>}</p>
                    </div>

                    <div className="data-row">
                        <p className="data-row-name">{t("stake:ValueOfYourEffectiveNextRewardAmount")}</p>
                        <p className="data-row-value"> {isAppLoading ? <Skeleton width="80px" /> : <>{valueOfYourEffectiveNextRewardAmount}</>}</p>
                    </div>

                    {Number(trimmedWrappedStakedSBBalance) > 0 && (
                        <div className="data-row">
                            <p className="data-row-name">{t("stake:ValueOfYourWrappedStakedSB")}</p>
                            <p className="data-row-value"> {isAppLoading ? <Skeleton width="80px" /> : <>{valueOfWrappedStakedBalance}</>}</p>
                        </div>
                    )}
                </>
            </div> */}
        </Grid>
    );
};
