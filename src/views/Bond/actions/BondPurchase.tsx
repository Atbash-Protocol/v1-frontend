import { Box, Grid, FormControl, InputAdornment, OutlinedInput, Button, Skeleton } from "@mui/material";
import { theme } from "constants/theme";
import { useWeb3Context } from "hooks/web3";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { calcBondDetails, depositBond } from "store/modules/bonds/bonds.thunks";
import { BondItem } from "store/modules/bonds/bonds.types";

interface BondPurchaseProps {
    bond: BondItem;
}

const BondPurchase = ({ bond }: BondPurchaseProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { provider } = useWeb3Context();

    const [max, setMax] = useState(0);
    const [quantity, setQuantity] = useState("");
    const [bondLoading, setBondLoading] = useState(false);

    const onBondAmountChange = ({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (value && !isNaN(parseInt(value)) && Number(quantity) <= max) {
            setQuantity(value);
        }
    };

    const onBondClick = () => {
        setBondLoading(true);
        dispatch(calcBondDetails({ bond: bond.bondInstance, value: Number(quantity) }));
        setBondLoading(false);
    };

    const depositBondAction = () => {
        dispatch(depositBond({ amount: Number(quantity), provider: provider.getSigner(), bond }));
    };

    useEffect(() => {
        if (bond.metrics.allowance !== null) {
            // No allowance
            setMax(bond.metrics.allowance);
        }

        if (bond && bond.metrics.loading === true) {
            // dispatch(calcBondDetails({ bond: bond.bondInstance, value: 0 }));
        }
    }, [bond]);

    return (
        <Box sx={{ color: "white" }}>
            <Grid container spacing={1}>
                <FormControl variant="outlined" color="primary" fullWidth></FormControl>
                <Grid xs={12}>
                    <OutlinedInput
                        placeholder={t("Amount")}
                        type="number"
                        value={quantity}
                        onChange={onBondAmountChange}
                        sx={{
                            color: theme.palette.secondary.main,
                            border: "1px solid",
                            outlineColor: theme.palette.secondary.main,
                            width: "100%",
                        }}
                        endAdornment={
                            <InputAdornment position="end">
                                <Box sx={{ color: theme.palette.secondary.main, textTransform: "uppercase" }} onClick={() => setMax(0)}>
                                    <p>{t("Max")}</p>
                                </Box>
                            </InputAdornment>
                        }
                    />
                </Grid>

                <Grid xs={12}>
                    {bondLoading && <Skeleton />}
                    {!bondLoading && (
                        <Button
                            disabled={quantity.length === 0}
                            sx={{
                                color: theme.palette.secondary.main,
                            }}
                            onClick={onBondClick}
                        >
                            {/* <p>{txnButtonText(pendingTransactions, "unstaking", t("Unstake BASH"))}</p> */}
                            Quote bond
                        </Button>
                    )}
                </Grid>
                <Grid xs={12}>
                    <Button
                        sx={{
                            color: theme.palette.secondary.main,
                        }}
                        onClick={depositBondAction}
                    >
                        {/* <p>{txnButtonText(pendingTransactions, "unstaking", t("Unstake BASH"))}</p> */}
                        Deposit bond
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default BondPurchase;
