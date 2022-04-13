import { shallowEqual, useSelector } from "react-redux";
import { formatTimer } from "helpers/prettify-seconds";
import { IReduxState } from "store/slices/state.interface";

import { useTranslation } from "react-i18next";
import { Box, Skeleton, Typography } from "@mui/material";
import { theme } from "constants/theme";
import { useState, useEffect } from "react";

const RebaseTimer = () => {
    const { t } = useTranslation();

    const nextRebase = useSelector<IReduxState, number | undefined>(state => {
        if (state.main.staking.epoch) {
            return state.main.staking.epoch.endTime;
        }
    }, shallowEqual);
    const currentBlockTime = useSelector<IReduxState, number>(state => state.main.blockchain.timestamp!);

    const [timeUntilRebase, setTimeUntilRebase] = useState<string | null>(null);

    useEffect(() => {
        if (currentBlockTime && nextRebase) {
            if (currentBlockTime > nextRebase) {
                const timeUntilRebase = formatTimer(currentBlockTime, nextRebase, t);
                setTimeUntilRebase(timeUntilRebase);
            }
        }
    }, [currentBlockTime, nextRebase]);

    if (!currentBlockTime || !nextRebase) return <Skeleton />;

    return (
        <Box sx={{ color: theme.palette.secondary.main, textTransform: "uppercase", letterSpacing: 2 }}>
            {timeUntilRebase ? <Typography>{t("TimeToNextRebase", { time: timeUntilRebase })}</Typography> : <Typography>{t("Rebasing")}</Typography>}
        </Box>
    );
};

export default RebaseTimer;
