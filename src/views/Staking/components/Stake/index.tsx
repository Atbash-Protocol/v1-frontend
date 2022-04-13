import OutlinedInput from "@mui/material/OutlinedInput";

import { Box, Button, Tab, Tabs, Typography, InputAdornment, Grid } from "@mui/material";
import { messages } from "constants/messages";
import { useWeb3Context } from "hooks/web3";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { IAccountSlice } from "store/account/account.types";
import { AccountSlice } from "store/modules/account/account.types";
import { stakeAction } from "store/modules/contracts/contracts.thunks";
import { StakeActionEnum } from "store/modules/contracts/contracts.types";
import { warning } from "store/slices/messages-slice";
import { IPendingTxn, isPendingTxn, txnButtonText } from "store/slices/pending-txns-slice";
import { changeApproval } from "store/slices/stake-thunk";
import { IReduxState } from "store/slices/state.interface";
import { theme } from "constants/theme";
import TabPanel from "components/Tabs/TabsPanel";

function Stake() {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const { provider, address, chainID, checkWrongNetwork } = useWeb3Context();

    const [quantity, setQuantity] = useState<number>(0);

    const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    const onSeekApproval = async (token: string) => {
        await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
    };

    const onChangeStake = async (action: string) => {
        if (await checkWrongNetwork()) return;
        if (quantity === 0) {
            dispatch(warning({ text: action === "stake" ? messages.before_stake : messages.before_unstake }));
        } else {
            // await dispatch(changeStake({ address, action, value: String(quantity), provider, networkID: chainID }));

            await dispatch(stakeAction({ address, provider, action: StakeActionEnum.STAKE, value: quantity }));
            setQuantity(0);
        }
    };

    const [viewId, setViewId] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, view: number) => {
        setViewId(view);
    };

    const { stakingAllowance, balances } = useSelector<IReduxState, AccountSlice>(state => state.accountNew);

    const setMax = () => {
        // dispatch(approveContract({ provider, target: "BASH" }));
        if (viewId === 0) {
            setQuantity(balances.BASH.toNumber());
        } else {
            setQuantity(balances.SBASH.toNumber());
        }
    };

    return (
        <>
            <Tabs
                value={viewId}
                onChange={handleTabChange}
                centered
                sx={{
                    "& .MuiButtonBase-root": {
                        color: theme.palette.secondary.main,
                    },
                }}
            >
                <Tab label={t("stake:Stake")} />
                <Tab label={t("stake:Unstake")} />
            </Tabs>

            <TabPanel value={viewId} index={0}>
                <Grid container spacing={1}>
                    <Grid xs={10}>
                        <OutlinedInput
                            sx={{
                                color: theme.palette.secondary.main,
                                border: "1px solid",
                                outlineColor: theme.palette.secondary.main,
                                width: "100%",
                            }}
                            color="primary"
                            type="number"
                            placeholder={t("Amount")}
                            value={quantity}
                            onChange={e => setQuantity(Number(e.target.value))}
                            endAdornment={
                                <InputAdornment position="end">
                                    <Box onClick={setMax}>
                                        <Typography sx={{ textTransform: "uppercase", color: theme.palette.secondary.main }}>{t("Max")}</Typography>
                                    </Box>
                                </InputAdornment>
                            }
                        />
                    </Grid>

                    <Grid item xs={2} sx={{ alignItems: "center" }}>
                        {stakingAllowance.BASH.gte(balances.BASH) ? (
                            <Button
                                sx={{
                                    color: theme.palette.secondary.main,
                                }}
                                onClick={() => {
                                    if (isPendingTxn(pendingTransactions, "staking")) return;
                                    onChangeStake("stake");
                                }}
                            >
                                <p>{txnButtonText(pendingTransactions, "staking", t("Stake BASH"))}</p>
                            </Button>
                        ) : (
                            <Button
                                sx={{ color: theme.palette.secondary.main }}
                                onClick={() => {
                                    if (isPendingTxn(pendingTransactions, "approve_staking")) return;
                                    onSeekApproval("BASH");
                                }}
                            >
                                <p>{txnButtonText(pendingTransactions, "approve_staking", t("Approve"))}</p>
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </TabPanel>

            <TabPanel value={viewId} index={1}>
                <Grid container spacing={1}>
                    <Grid xs={10}>
                        <OutlinedInput
                            sx={{
                                color: theme.palette.secondary.main,
                                border: "1px solid",
                                outlineColor: theme.palette.secondary.main,
                                width: "100%",
                            }}
                            type="number"
                            placeholder={t("Amount")}
                            value={quantity}
                            onChange={e => setQuantity(Number(e.target.value))}
                            endAdornment={
                                <InputAdornment position="end">
                                    <Box sx={{ color: theme.palette.secondary.main, textTransform: "uppercase" }} onClick={setMax}>
                                        <p>{t("Max")}</p>
                                    </Box>
                                </InputAdornment>
                            }
                        />
                    </Grid>
                    <Grid item xs={2} sx={{ alignItems: "center" }}>
                        {address && stakingAllowance.SBASH.gte(balances.SBASH) ? (
                            <Button
                                sx={{
                                    color: theme.palette.secondary.main,
                                }}
                                onClick={() => {
                                    if (isPendingTxn(pendingTransactions, "unstaking")) return;
                                    onChangeStake("unstake");
                                }}
                            >
                                <p>{txnButtonText(pendingTransactions, "unstaking", t("Unstake BASH"))}</p>
                            </Button>
                        ) : (
                            <Button
                                onClick={() => {
                                    if (isPendingTxn(pendingTransactions, "approve_unstaking")) return;
                                    onSeekApproval("sBASH");
                                }}
                            >
                                <p>{txnButtonText(pendingTransactions, "approve_unstaking", t("Approve"))}</p>
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </TabPanel>
        </>
    );
}

export default Stake;
