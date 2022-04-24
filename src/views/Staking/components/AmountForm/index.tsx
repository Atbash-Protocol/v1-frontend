import { Typography } from "@material-ui/core";
import { Box, Button, Grid, InputAdornment, OutlinedInput } from "@mui/material";
import { theme } from "constants/theme";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { isPendingTxn, selectIsPendingTransactionType } from "store/slices/pending-txns-slice";
import { IReduxState } from "store/slices/state.interface";

interface AmountFormProps {
    initialValue: number;
    placeholder?: string;
    maxValue: number;
    transactionType: any; // TODO: transaction types
    approvesNeeded: boolean;
    onApprove: Function;
    onAction: Function;
    approveLabel: string;
    actionLabel: string;
}

const AmountForm = (props: AmountFormProps) => {
    const { t } = useTranslation();
    const { initialValue, placeholder, maxValue, transactionType, approvesNeeded, onApprove, onAction, approveLabel, actionLabel } = props;

    const [value, setValue] = useState(initialValue);
    const selectPendingTransaction = useSelector<IReduxState, boolean>(state => selectIsPendingTransactionType(state, transactionType));

    const handleChange = (e: any) => {
        setValue(Number(e.target.value));
    };

    const handleClickMaxValue = (e: any) => {
        setValue(maxValue);
    };

    const handleActionClick = useCallback(
        e => {
            e.preventDefault();

            if (selectPendingTransaction) return;

            if (approvesNeeded) {
                return onApprove(transactionType);
            }

            return onAction(value);
        },
        [onApprove, onAction, value, transactionType],
    );

    return (
        <Grid container spacing={1}>
            <Grid xs={10}>
                <OutlinedInput
                    sx={{
                        color: theme.palette.primary.main,
                        border: "1px solid",
                        outlineColor: theme.palette.primary.main,
                        width: "100%",
                    }}
                    type="number"
                    placeholder={placeholder ?? t("Amount")}
                    value={value}
                    onChange={handleChange}
                    endAdornment={
                        <InputAdornment position="end">
                            <Box sx={{ color: theme.palette.primary.main, textTransform: "uppercase", cursor: "pointer" }} onClick={handleClickMaxValue}>
                                <p>{t("Max")}</p>
                            </Box>
                        </InputAdornment>
                    }
                />
            </Grid>
            <Grid xs={2} p={0}>
                <Button
                    sx={{
                        color: theme.palette.primary.main,
                    }}
                    onClick={handleActionClick}
                >
                    <Typography variant="body1"> {approvesNeeded ? approveLabel : actionLabel}</Typography>
                </Button>
            </Grid>
        </Grid>
    );
};

const memoAmountForm = (props: AmountFormProps) => useMemo(() => <AmountForm {...props} />, [props]);
export default memoAmountForm;
