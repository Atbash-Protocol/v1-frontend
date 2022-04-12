import { Box, InputAdornment, OutlinedInput } from "@mui/material";
import { messages } from "constants/messages";
import { theme } from "constants/theme";
import { t } from "i18next";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { stakeAction } from "store/modules/contracts/contracts.thunks";
import { StakeActionEnum } from "store/modules/contracts/contracts.types";
import { warning } from "store/slices/messages-slice";
import { IPendingTxn, isPendingTxn, txnButtonText } from "store/slices/pending-txns-slice";
import { IReduxState } from "store/slices/state.interface";

interface StakeActionProps {
    balance: number;
    allowance: number;
}

const StakeAction = (props: StakeActionProps) => {
    const { balance } = props;

    const [quantity, setQuantity] = useState<number>(0);
    // const dispatch = useDispatch();
    // const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
    //     return state.pendingTransactions;
    // });
    // const { stakingAllowance, balances } = useSelector<IReduxState, AccountSlice>(state => state.accountNew);

    // const onChangeStake = async (action: string) => {
    //     if (quantity === 0) {
    //         dispatch(warning({ text: action === "stake" ? messages.before_stake : messages.before_unstake }));
    //     } else {
    //         await dispatch(stakeAction({ address, provider, action: StakeActionEnum.STAKE, value: quantity }));
    //         setQuantity(0);
    //     }
    // };

    return (
        <>
            <OutlinedInput
                sx={{ color: theme.palette.secondary.main, border: "1px solid", outlineColor: theme.palette.secondary.main, width: "80%" }}
                color="primary"
                type="number"
                placeholder={t("Amount")}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                endAdornment={
                    <InputAdornment position="end">
                        <div onClick={() => setQuantity(balance)} className="stake-card-action-input-btn">
                            <p>{t("Max")}</p>
                        </div>
                    </InputAdornment>
                }
            />

            <Box sx={{ textAlign: "center", width: "20%" }}>
                {/* {allowance > 0 ? (
                    <Box
                        onClick={() => {
                            if (isPendingTxn(pendingTransactions, "staking")) return;
                            onChangeStake("stake");
                        }}
                    >
                        <p>{txnButtonText(pendingTransactions, "staking", t("Stake BASH"))}</p>
                    </Box>
                ) : (
                    <Box
                        onClick={() => {
                            if (isPendingTxn(pendingTransactions, "approve_staking")) return;
                            onSeekApproval("BASH");
                        }}
                    >
                        <p>{txnButtonText(pendingTransactions, "approve_staking", t("Approve"))}</p>
                    </Box>
                )} */}
            </Box>
        </>
    );
};
