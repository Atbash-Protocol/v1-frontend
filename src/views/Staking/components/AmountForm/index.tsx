import { useCallback, useState, MouseEvent, ChangeEvent } from 'react';

import { Box, Button, CircularProgress, Grid, InputAdornment, OutlinedInput, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { theme } from 'constants/theme';
import { addNotification } from 'store/modules/messages/messages.slice';
import { selectPendingTx } from 'store/modules/transactions/transactions.selectors';
import { TransactionType } from 'store/modules/transactions/transactions.type';
import { IReduxState } from 'store/slices/state.interface';

interface AmountFormProps {
    initialValue: number;
    maxValue: number;
    transactionType: TransactionType;
    approvesNeeded: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onApprove: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onAction: any;
    approveLabel: string;
    actionLabel: string;
    isLoading?: boolean;
}

const AmountForm = (props: AmountFormProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { initialValue, maxValue, transactionType, approvesNeeded, onApprove, onAction, approveLabel, actionLabel, isLoading } = props;

    const [value, setValue] = useState<string>('');
    const selectPendingTransaction = useSelector<IReduxState, boolean>(state => selectPendingTx(state, transactionType));

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setValue(e.target.value);
    };

    const handleClickMaxValue = () => {
        setValue(maxValue.toString());
    };

    const handleActionClick = useCallback(
        (e: MouseEvent) => {
            e.preventDefault();

            if (selectPendingTransaction) return;

            if (approvesNeeded) {
                return onApprove(transactionType);
            }

            if (value === '0') {
                return dispatch(addNotification({ severity: 'warning', description: 'Please provide an amount' }));
            }

            return onAction(value);
        },
        [onApprove, onAction, value, transactionType],
    );

    return (
        <Grid container>
            <Grid item xs={10}>
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
                    placeholder={initialValue.toString()}
                    value={value}
                    onChange={handleChange}
                    inputProps={{ inputMode: 'numeric', pattern: '^[0-9]*[.,]?[0-9]*$' }}
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
            <Grid item xs={2} p={0}>
                <Button
                    sx={{
                        padding: 0,
                        color: theme.palette.primary.main,
                    }}
                    disabled={isLoading}
                    onClick={handleActionClick}
                >
                    {isLoading && <CircularProgress color="secondary" />}

                    {!isLoading && (
                        <Typography
                            variant="body1"
                            sx={{
                                [theme.breakpoints.down('sm')]: {
                                    maxWidth: '9ch',
                                    padding: 0,
                                    overflow: 'hidden',
                                    fontSize: '.5rem',
                                    whiteSpace: 'nowrap',
                                },
                            }}
                        >
                            {' '}
                            {approvesNeeded ? approveLabel : actionLabel}
                        </Typography>
                    )}
                </Button>
            </Grid>
        </Grid>
    );
};

export default AmountForm;
