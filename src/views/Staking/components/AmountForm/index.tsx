import { useCallback, useMemo, useState, MouseEvent, ChangeEvent } from 'react';

import { Box, Button, Grid, InputAdornment, OutlinedInput, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { theme } from 'constants/theme';
import { selectIsPendingTransactionType, TransactionType } from 'store/slices/pending-txns-slice';
import { IReduxState } from 'store/slices/state.interface';

interface AmountFormProps {
    initialValue: number;
    placeholder?: string;
    maxValue: number;
    transactionType: TransactionType; // TODO: transaction types
    approvesNeeded: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onApprove: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onAction: any;
    approveLabel: string;
    actionLabel: string;
}

const AmountForm = (props: AmountFormProps) => {
    const { t } = useTranslation();
    const { initialValue, placeholder, maxValue, transactionType, approvesNeeded, onApprove, onAction, approveLabel, actionLabel } = props;

    const [value, setValue] = useState(initialValue);
    const selectPendingTransaction = useSelector<IReduxState, boolean>(state => selectIsPendingTransactionType(state, transactionType));

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(Number(e.target.value));
    };

    const handleClickMaxValue = () => {
        setValue(maxValue);
    };

    const handleActionClick = useCallback(
        (e: MouseEvent) => {
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
        <Grid container>
            <Grid xs={10}>
                <OutlinedInput
                    sx={{
                        color: theme.palette.primary.main,
                        border: '1px solid',
                        borderColor: theme.palette.primary.main,
                        borderRadius: 0,
                        outlineColor: theme.palette.primary.main,
                        borderRight: 'none',
                        width: '100%',
                    }}
                    type="number"
                    placeholder={placeholder ?? t('Amount')}
                    value={value}
                    onChange={handleChange}
                    endAdornment={
                        <InputAdornment position="end">
                            <Box sx={{ color: theme.palette.primary.main, textTransform: 'uppercase', cursor: 'pointer' }} onClick={handleClickMaxValue}>
                                <Typography>
                                    <>{t('Max')}</>
                                </Typography>
                            </Box>
                        </InputAdornment>
                    }
                />
            </Grid>
            <Grid xs={2} p={0}>
                <Button
                    sx={{
                        padding: 0,
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

const useAmountForm = (props: AmountFormProps) => useMemo(() => <AmountForm {...props} />, [props]);

export default useAmountForm;
