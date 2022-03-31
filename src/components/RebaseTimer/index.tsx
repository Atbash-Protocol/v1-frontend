import { shallowEqual, useSelector } from "react-redux";
import { formatTimer } from "helpers/prettify-seconds";
import { IReduxState } from "store/slices/state.interface";

import { useTranslation } from "react-i18next";
import { IAppSlice } from "store/slices/app-slice";
import { Box, Skeleton, Typography } from "@mui/material";
import { theme } from "constants/theme";
import { useState, useEffect } from "react";

const RebaseTimer = () => {
    const { t } = useTranslation();

    const { currentBlockTime, nextRebase } = useSelector<IReduxState, Pick<IAppSlice, "currentBlockTime" | "nextRebase">>(state => state.app, shallowEqual);

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
