import { useSelector } from "react-redux";
import { secondsUntilBlock, prettifySeconds } from "../../helpers";
import { Box } from "@material-ui/core";
import "./rebasetimer.scss";
import { Skeleton } from "@material-ui/lab";
import { useEffect, useMemo } from "react";
import { IReduxState } from "../../store/slices/state.interface";

import { useTranslation } from "react-i18next";

function RebaseTimer() {
    const { t } = useTranslation();

    const currentBlockTime = useSelector<IReduxState, number>(state => state.app.currentBlockTime);
    const nextRebase = useSelector<IReduxState, number>(state => state.app.nextRebase);

    const timeUntilRebase = useMemo(() => {
        console.log("here", currentBlockTime, nextRebase);
        if (currentBlockTime && nextRebase) {
            const seconds = secondsUntilBlock(currentBlockTime, nextRebase);
            return prettifySeconds(seconds);
        }
    }, [currentBlockTime, nextRebase]);

    useEffect(() => {
        console.log("loaded", currentBlockTime, nextRebase);
    }, []);

    console.log("rebase", currentBlockTime, nextRebase, timeUntilRebase);

    return (
        <Box className="rebase-timer">
            <p>{currentBlockTime ? timeUntilRebase ? <>{t("TimeToNextRebase", { time: timeUntilRebase })}</> : <span>{t("Rebasing")}</span> : <Skeleton width="200px" />}</p>
        </Box>
    );
}

export default RebaseTimer;
