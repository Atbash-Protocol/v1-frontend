// import OutlinedInput from "@mui/material/OutlinedInput";

// import { Box, Button, Tab, Tabs, Typography, InputAdornment, Grid, FormControl, Input, InputLabel } from "@mui/material";
// import { messages } from "constants/messages";
// import { useWeb3Context } from "hooks/web3";
// import { useCallback, useContext, useEffect, useMemo, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { useDispatch, useSelector } from "react-redux";
// import { IAccountSlice } from "store/account/account.types";
// import { AccountSlice } from "store/modules/account/account.types";
// import { stakeAction } from "store/modules/contracts/contracts.thunks";
// import { StakeActionEnum } from "store/modules/contracts/contracts.types";
// import { warning } from "store/slices/messages-slice";
// import { IPendingTxn, isPendingTxn, selectIsStakingPendingTx, txnButtonText } from "store/slices/pending-txns-slice";
// import { changeApproval } from "store/slices/stake-thunk";
// import { IReduxState } from "store/slices/state.interface";
// import { theme } from "constants/theme";
// import TabPanel from "components/Tabs/TabsPanel";
// import { PWeb3Context } from "contexts/web3/web3.context";
// import { t } from "i18next";
// import { BigNumber } from "ethers";
// import _ from "lodash";
// import { AccountCircle } from "@material-ui/icons";

// const StakeAction = ({ amount, stakingAllowance, balance }: { amount: number; balance: BigNumber; stakingAllowance: BigNumber }) => {
//     const dispatch = useDispatch();

//     const selectStakingPendingTx = useSelector(selectIsStakingPendingTx);
//     const handleStakingClick = useCallback(() => {
//         if (selectStakingPendingTx) return;

//         dispatch(stakeAction({ action: StakeActionEnum.STAKE, amount }));
//     }, [selectIsStakingPendingTx]);

//     const handleApproveClick = useCallback(() => {
//         if (selectStakingPendingTx) return; // TODO: approve transactions

//         // dispatch(approve);
//     }, [selectStakingPendingTx]);

//     useEffect(() => {
//         console.log("render", amount, stakingAllowance, balance);
//     });

//     if (stakingAllowance.gte(balance)) {
//         return (
//             <Button
//                 sx={{
//                     color: theme.palette.primary.main,
//                 }}
//                 onClick={handleStakingClick}
//             >
//                 <Typography variant="body1">{selectStakingPendingTx ? t("PendingEllipsis") : t("Stake BASH")}</Typography>
//             </Button>
//         );
//     }

//     return (
//         <Button sx={{ color: theme.palette.primary.main }} onClick={handleApproveClick}>
//             <Typography variant="body1">{selectStakingPendingTx ? t("PendingEllipsis") : <>"TODO"</>}</Typography>
//         </Button>
//     );
// };

// //                      {stakingAllowance.BASH.gte(balances.BASH) ? (
// //                         <Button
// //                             sx={{
// //                                 color: theme.palette.primary.main,
// //                             }}
// //                             onClick={() => {
// //                                 if (isPendingTxn(pendingTransactions, "staking")) return;
// //                                 onChangeStake("stake");
// //                             }}
// //                         >
// //                             <p>{txnButtonText(pendingTransactions, "staking", t("Stake BASH"))}</p>
// //                         </Button>
// //                     ) : (
// //                         <Button
// //                             sx={{ color: theme.palette.primary.main }}
// //                             onClick={() => {
// //                                 if (isPendingTxn(pendingTransactions, "approve_staking")) return;
// //                                 onSeekApproval("BASH");
// //                             }}
// //                         >
// //                             <p>{txnButtonText(pendingTransactions, "approve_staking", t("Approve"))}</p>
// //                         </Button>
// //                     )}
// // }

// function Stake() {
//     const { t } = useTranslation();

//     const dispatch = useDispatch();
//     // const { provider, address, chainID, checkWrongNetwork } = useWeb3Context();

//     const {
//         state: { signer },
//     } = useContext(PWeb3Context);

//     const [quantity, setQuantity] = useState<number>(0);

//     // const stakeAction1 = useMemo(() => _.debounce(() => <StakeAction amount={quantity} stakingAllowance={stakingAllowance.BASH} balance={balances.BASH} />, 500), [quantity]);

//     const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
//         return state.pendingTransactions;
//     });

//     const onSeekApproval = async (token: string) => {
//         // await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
//     };

//     const onChangeStake = async (action: string) => {
//         // if (await checkWrongNetwork()) return;
//         // if (quantity === 0) {
//         //     dispatch(warning({ text: action === "stake" ? messages.before_stake : messages.before_unstake }));
//         // } else {
//         //     // await dispatch(changeStake({ address, action, value: String(quantity), provider, networkID: chainID }));
//         //     await dispatch(stakeAction({ address, provider, action: StakeActionEnum.STAKE, value: quantity }));
//         //     setQuantity(0);
//         // }
//     };

//     const [viewId, setViewId] = useState(0);

//     const handleTabChange = (event: React.SyntheticEvent, view: number) => {
//         console.log("tabChange", event, view);
//         setViewId(view);
//     };

//     const { stakingAllowance, balances } = useSelector<IReduxState, AccountSlice>(state => state.accountNew);

//     const setMax = () => {
//         // dispatch(approveContract({ provider, target: "BASH" }));
//         if (viewId === 0) {
//             setQuantity(balances.BASH.toNumber());
//         } else {
//             setQuantity(balances.SBASH.toNumber());
//         }
//     };

//     const handleSetMax = useCallback(
//         event => {
//             setQuantity(viewId === 0 ? balances.BASH.toNumber() : balances.SBASH.toNumber());
//         },
//         [balances],
//     );

//     const onChange = (event: any) => {
//         debounce(event.target.value);
//     };

//     const debounce = useCallback(
//         _.debounce(_searchVal => {
//             if (_.isNumber(_searchVal)) setQuantity(_searchVal);
//             // send the server request here
//         }, 1000),
//         [],
//     );
//     // const tabPanels = [
//     //     <TabPanel value={viewId} index={0}>
//     //         <Grid container spacing={1}>
//     //             <Grid xs={10}>
//     //                 <OutlinedInput
//     //                     sx={{
//     //                         color: theme.palette.primary.main,
//     //                         border: "1px solid",
//     //                         outlineColor: theme.palette.primary.main,
//     //                         width: "100%",
//     //                     }}
//     //                     color="primary"
//     //                     type="number"
//     //                     placeholder={t("Amount")}
//     //                     value={quantity}
//     //                     onChange={e => setQuantity(Number(e.target.value))}
//     //                     endAdornment={
//     //                         <InputAdornment position="end">
//     //                             <Box onClick={handleSetMax}>
//     //                                 <Typography sx={{ textTransform: "uppercase", color: theme.palette.primary.main }}>{t("Max")}</Typography>
//     //                             </Box>
//     //                         </InputAdornment>
//     //                     }
//     //                 />
//     //             </Grid>

//     //             <Grid item xs={2} sx={{ alignItems: "center" }}>
//     //                 {stakingAllowance.BASH.gte(balances.BASH) ? (
//     //                     <Button
//     //                         sx={{
//     //                             color: theme.palette.primary.main,
//     //                         }}
//     //                         onClick={() => {
//     //                             if (isPendingTxn(pendingTransactions, "staking")) return;
//     //                             onChangeStake("stake");
//     //                         }}
//     //                     >
//     //                         <p>{txnButtonText(pendingTransactions, "staking", t("Stake BASH"))}</p>
//     //                     </Button>
//     //                 ) : (
//     //                     <Button
//     //                         sx={{ color: theme.palette.primary.main }}
//     //                         onClick={() => {
//     //                             if (isPendingTxn(pendingTransactions, "approve_staking")) return;
//     //                             onSeekApproval("BASH");
//     //                         }}
//     //                     >
//     //                         <p>{txnButtonText(pendingTransactions, "approve_staking", t("Approve"))}</p>
//     //                     </Button>
//     //                 )}
//     //             </Grid>
//     //         </Grid>
//     //     </TabPanel>,
//     // ];

//     return (
//         <Box>
//             <Tabs
//                 value={viewId}
//                 onChange={handleTabChange}
//                 centered
//                 sx={{
//                     "& .MuiButtonBase-root": {
//                         color: theme.palette.primary.main,
//                     },
//                 }}
//             >
//                 <Tab label={t("stake:Stake")} />
//                 <Tab label={t("stake:Unstake")} />
//             </Tabs>

//             <TabPanel value={viewId} index={0}>
//                 {/* <Grid container spacing={1}>
//                     <Grid xs={10}>
//                         <OutlinedInput
//                             sx={{
//                                 color: theme.palette.primary.main,
//                                 border: "1px solid",
//                                 outlineColor: theme.palette.primary.main,
//                                 width: "100%",
//                             }}
//                             color="primary"
//                             type="number"
//                             placeholder={t("Amount")}
//                             value={quantity}
//                             onChange={onChange}
//                             endAdornment={
//                                 <InputAdornment position="end">
//                                     <Box onClick={setMax}>
//                                         <Typography sx={{ textTransform: "uppercase", color: theme.palette.primary.main }}>{t("Max")}</Typography>
//                                     </Box>
//                                 </InputAdornment>
//                             }
//                         />
//                     </Grid>

//                     <StakeAction amount={quantity} stakingAllowance={stakingAllowance.BASH} balance={balances.BASH} />

//                     <Grid item xs={2} sx={{ alignItems: "center" }}>
//                         {stakingAllowance.BASH.gte(balances.BASH) ? (
//                             <Button
//                                 sx={{
//                                     color: theme.palette.primary.main,
//                                 }}
//                                 onClick={() => {
//                                     if (isPendingTxn(pendingTransactions, "staking")) return;
//                                     onChangeStake("stake");
//                                 }}
//                             >
//                                 <p>{txnButtonText(pendingTransactions, "staking", t("Stake BASH"))}</p>
//                             </Button>
//                         ) : (
//                             <Button
//                                 sx={{ color: theme.palette.primary.main }}
//                                 onClick={() => {
//                                     if (isPendingTxn(pendingTransactions, "approve_staking")) return;
//                                     onSeekApproval("BASH");
//                                 }}
//                             >
//                                 <p>{txnButtonText(pendingTransactions, "approve_staking", t("Approve"))}</p>
//                             </Button>
//                         )}
//                     </Grid>
//                 </Grid> */}
//             </TabPanel>

//             <TabPanel value={viewId} index={1}>
//                 {/* <Grid container spacing={1}>
//                     <Grid xs={10}>
//                         <OutlinedInput
//                             sx={{
//                                 color: theme.palette.primary.main,
//                                 border: "1px solid",
//                                 outlineColor: theme.palette.primary.main,
//                                 width: "100%",
//                             }}
//                             type="number"
//                             placeholder={t("Amount")}
//                             value={quantity}
//                             onChange={e => setQuantity(Number(e.target.value))}
//                             endAdornment={
//                                 <InputAdornment position="end">
//                                     <Box sx={{ color: theme.palette.primary.main, textTransform: "uppercase" }} onClick={setMax}>
//                                         <p>{t("Max")}</p>
//                                     </Box>
//                                 </InputAdornment>
//                             }
//                         />
//                     </Grid>
//                     <Grid item xs={2} sx={{ alignItems: "center" }}>
//                         {signer && stakingAllowance.SBASH.gte(balances.SBASH) ? (
//                             <Button
//                                 sx={{
//                                     color: theme.palette.primary.main,
//                                 }}
//                                 onClick={() => {
//                                     if (isPendingTxn(pendingTransactions, "unstaking")) return;
//                                     onChangeStake("unstake");
//                                 }}
//                             >
//                                 <p>{txnButtonText(pendingTransactions, "unstaking", t("Unstake BASH"))}</p>
//                             </Button>
//                         ) : (
//                             <Button
//                                 onClick={() => {
//                                     if (isPendingTxn(pendingTransactions, "approve_unstaking")) return;
//                                     onSeekApproval("sBASH");
//                                 }}
//                             >
//                                 <p>{txnButtonText(pendingTransactions, "approve_unstaking", t("Approve"))}</p>
//                             </Button>
//                         )}
//                     </Grid>
//                 </Grid> */}
//             </TabPanel>
//         </Box>
//     );
// }

// export default Stake;

import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AmountForm from "../AmountForm";
import { useDispatch, useSelector } from "react-redux";
import { selectStakeBalanceAndAllowances } from "store/modules/account/account.selectors";
import { BigNumber } from "ethers";
import { stakeAction } from "store/modules/contracts/contracts.thunks";
import { StakeActionEnum } from "store/modules/contracts/contracts.types";
import { approveContract } from "store/modules/stake/stake.thunks";
import { useSafeSigner } from "lib/web3/web3.hooks";
import { useTranslation } from "react-i18next";
import { theme } from "constants/theme";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`stake-tabpanel-${index}`} aria-labelledby={`stake-tab-${index}`} {...other}>
            {value === index && (
                <Box sx={{ p: 3, color: "red" }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `stake-tab-${index}`,
        "aria-controls": `stake-tabpanel-${index}`,
        sx: {
            color: "white",
        },
    };
}

export default function BasicTabs() {
    const dispatch = useDispatch();
    const [value, setValue] = React.useState(0);
    const { t } = useTranslation();

    const { signer, signerAddress } = useSafeSigner();

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const { balances, stakingAllowance } = useSelector(selectStakeBalanceAndAllowances);

    const handleStakingClick = React.useCallback(amount => {
        dispatch(stakeAction({ action: StakeActionEnum.STAKE, amount }));
    }, []);

    const handleApproveClick = React.useCallback(
        target => {
            dispatch(approveContract({ signer, signerAddress, target }));
        },
        [signer],
    );

    return (
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs centered value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label={t("stake:Stake")} {...a11yProps(0)} />
                <Tab label={t("stake:Unstake")} {...a11yProps(1)} />
            </Tabs>
            <TabPanel value={value} index={0}>
                <AmountForm
                    initialValue={0}
                    maxValue={balances.BASH}
                    transactionType={"BASH_APPROVAL"}
                    approvesNeeded={stakingAllowance.BASH.eq(BigNumber.from(0))}
                    onApprove={handleApproveClick}
                    onAction={handleStakingClick}
                    approveLabel={t("stake:ApproveStaking")}
                    actionLabel={t("stake:Staking")}
                />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <AmountForm
                    initialValue={balances.SBASH}
                    maxValue={balances.SBASH}
                    transactionType={"SBASH_APPROVAL"}
                    approvesNeeded={stakingAllowance.SBASH.eq(BigNumber.from(0))}
                    onApprove={handleApproveClick}
                    onAction={handleStakingClick}
                    approveLabel={t("stake:ApproveUnstaking")}
                    actionLabel={t("stake:Unstaking")}
                />
            </TabPanel>
        </Box>
    );
}
