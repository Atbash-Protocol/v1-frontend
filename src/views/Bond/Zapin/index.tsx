import React, { useState, useCallback, useEffect } from "react";
import { ReactComponent as XIcon } from "../../../assets/icons/x.svg";
import { Box, Modal, Paper, SvgIcon, IconButton, OutlinedInput, InputAdornment } from "@material-ui/core";
import "./zapin.scss";
import ArrowUpImg from "../../../assets/icons/arrow-down.svg";
import { Skeleton } from "@material-ui/lab";
import ChooseToken from "./ChooseToken";
import { IAllBondData } from "hooks/bonds";
import useTokens, { IAllTokenData } from "hooks/tokens";
import { avax, DAI } from "helpers/tokens";
import { shorten, trim } from "helpers";
import BondLogo from "components/BondLogo";
import { useDispatch, useSelector } from "react-redux";
import { IReduxState } from "store/slices/state.interface";
import { changeApproval, calcZapinDetails, ITokenZapinResponse, zapinMint } from "store/slices/zapin-thunk";
import { IPendingTxn, isPendingTxn, txnButtonText } from "store/slices/pending-txns-slice";
import { useWeb3Context } from "hooks";
import { wavax } from "helpers/bond";
import AdvancedSettings from "../AdvancedSettings";
import { ReactComponent as SettingsIcon } from "../../../assets/icons/settings.svg";
import { warning } from "store/slices/messages-slice";
import { messages } from "constants/messages";
import { utils } from "ethers";
import { calcBondDetails } from "store/slices/bond-slice";

import { useTranslation } from "react-i18next";

interface IZapinProps {
    open: boolean;
    handleClose: () => void;
    bond: IAllBondData;
}

function Zapin({ open, handleClose, bond }: IZapinProps) {
    const { t } = useTranslation();

    const { tokens } = useTokens();
    const { provider, address, chainID, checkWrongNetwork } = useWeb3Context();
    const dispatch = useDispatch();

    const isBondLoading = useSelector<IReduxState, boolean>(state => state.bonding.loading ?? true);
    const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    let defaultToken = tokens.find(token => token.name === avax.name);

    if (bond.name === wavax.name) {
        defaultToken = tokens.find(token => token.name === DAI.name);
    }

    const [quantity, setQuantity] = useState<string>("");
    //@ts-ignore
    const [token, setToken] = useState<IAllTokenData>(defaultToken);
    const [chooseTokenOpen, setChooseTokenOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [slippage, setSlippage] = useState(2);
    const [recipientAddress, setRecipientAddress] = useState(address);
    const [swapInfo, setSwapInfo] = useState<ITokenZapinResponse>({ swapData: "", swapTarget: "", amount: "" });
    const [priceToken, setPriceToken] = useState<number>(0);

    const [loading, setLoading] = useState(false);

    const hasAllowance = useCallback(() => {
        return token.allowance > 0;
    }, [token.allowance]);

    const onSeekApproval = async () => {
        if (await checkWrongNetwork()) return;

        dispatch(changeApproval({ address, token, provider, networkID: chainID }));
    };

    const onMint = async () => {
        if (await checkWrongNetwork()) return;

        if (!swapInfo.amount || !swapInfo.swapData || !swapInfo.swapTarget) {
            return dispatch(warning({ text: messages.something_wrong }));
        }

        dispatch(
            zapinMint({
                provider,
                networkID: chainID,
                bond,
                token,
                value: quantity,
                minReturnAmount: swapInfo.amount,
                swapTarget: swapInfo.swapTarget,
                swapData: swapInfo.swapData,
                slippage,
                address,
            }),
        );
    };

    const onRecipientAddressChange = (value: any) => {
        return setRecipientAddress(value);
    };

    const onSlippageChange = (value: any) => {
        return setSlippage(value);
    };

    const setMax = () => {
        const maxBondPriceToken = bond.maxBondPriceToken / priceToken;
        let amount: any = Math.min(maxBondPriceToken, token.isAvax ? token.balance * 0.99 : token.balance);

        if (amount) {
            amount = trim(amount);
        }

        setQuantity((amount || "").toString());
    };

    useEffect(() => {
        if (address) setRecipientAddress(address);
    }, [provider, address]);

    useEffect(() => {
        let timeount: any = null;

        clearTimeout(timeount);

        if (Number(quantity) > 0) {
            setLoading(true);
            timeount = setTimeout(async () => {
                const info = await calcZapinDetails({ token, provider, networkID: chainID, bond, value: quantity, slippage, dispatch });
                if (info.amount) {
                    const amount = utils.formatEther(info.amount);
                    dispatch(calcBondDetails({ bond, value: amount, provider, networkID: chainID }));
                } else {
                    dispatch(calcBondDetails({ bond, value: "0", provider, networkID: chainID }));
                }
                setSwapInfo(info);
                setLoading(false);
            }, 1000);
        } else {
            setSwapInfo({ swapData: "", swapTarget: "", amount: "" });
            dispatch(calcBondDetails({ bond, value: "0", provider, networkID: chainID }));
            setLoading(false);
        }
        return () => clearTimeout(timeount);
    }, [quantity, slippage]);

    useEffect(() => {
        setTimeout(async () => {
            const { amount } = await calcZapinDetails({ token, provider, networkID: chainID, bond, value: "1", slippage, dispatch });
            if (amount) {
                const amountValue = utils.formatEther(amount);
                setPriceToken(Number(amountValue));
            }
        }, 500);
    }, [token, slippage]);

    let minimumReceivedAmount = "0";

    if (swapInfo.amount) {
        const minimumReceivedAmountValue = utils.formatEther(swapInfo.amount);
        minimumReceivedAmount = trim(Number(minimumReceivedAmountValue), 6);
    }

    const handleChooseTokenOpen = () => {
        setChooseTokenOpen(true);
    };

    const handleChooseTokenClose = () => {
        setChooseTokenOpen(false);
    };

    const handleChooseTokenSelect = (token: IAllTokenData) => {
        setQuantity("");
        setToken(token);
        setChooseTokenOpen(false);
    };

    const handleSettingsOpen = () => {
        setSettingsOpen(true);
    };

    const handleSettingsClose = () => {
        setSettingsOpen(false);
    };

    const isLoading = isBondLoading || loading;

    return (
        <Modal id="hades" open={open} onClose={handleClose} hideBackdrop>
            <Paper className="ohm-card ohm-popover zapin-poper">
                <div className="cross-wrap">
                    <IconButton onClick={handleClose}>
                        <SvgIcon color="primary" component={XIcon} />
                    </IconButton>
                    <IconButton style={{ marginLeft: "auto" }} onClick={handleSettingsOpen}>
                        <SvgIcon color="primary" component={SettingsIcon} />
                    </IconButton>
                </div>
                <Box className="card-content">
                    <div className="zapin-header">
                        <div className="zapin-header-token-select-wrap">
                            <p className="zapin-header-token-select-title">{t("bond:ZapinAndMint")}</p>
                            <OutlinedInput
                                type="number"
                                placeholder="Amount"
                                className="zapin-header-token-select-input"
                                value={quantity}
                                onChange={e => setQuantity(e.target.value)}
                                labelWidth={0}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <div onClick={handleChooseTokenOpen} className="zapin-header-token-select-input-token-select">
                                            <img className="zapin-header-token-select-input-token-select-logo" src={token.img} alt="" />
                                            <p>{token.name}</p>
                                            <Box display="flex" alignItems="center" justifyContent="center" width={"16px"}>
                                                <img src={ArrowUpImg} style={{ height: "16px", width: "16px" }} />
                                            </Box>
                                        </div>
                                    </InputAdornment>
                                }
                                endAdornment={
                                    <InputAdornment position="end">
                                        <div className="zapin-header-token-select-input-btn" onClick={setMax}>
                                            <p>Max</p>
                                        </div>
                                    </InputAdornment>
                                }
                            />
                            {hasAllowance() || token.isAvax ? (
                                <div
                                    className="zapin-header-token-select-btn"
                                    onClick={async () => {
                                        if (isPendingTxn(pendingTransactions, "zapin_" + token.name + "_" + bond.name)) return;
                                        await onMint();
                                    }}
                                >
                                    <p>{txnButtonText(pendingTransactions, "zapin_" + token.name + "_" + bond.name, t("bond:Mint"))}</p>
                                </div>
                            ) : (
                                <div
                                    className="zapin-header-token-select-btn"
                                    onClick={async () => {
                                        if (isPendingTxn(pendingTransactions, "approve_" + token.address)) return;
                                        await onSeekApproval();
                                    }}
                                >
                                    <p>{txnButtonText(pendingTransactions, "approve_" + token.address, t("Approve"))}</p>
                                </div>
                            )}
                        </div>
                        {!hasAllowance() && !token.isAvax && (
                            <div className="zapin-header-help-text">
                                <p>{t("bond:ZapinHelpText.FirstRow")}</p>
                                <p>{t("bond:ZapinHelpText.SecondRow")}</p>
                                <p>{t("bond:ZapinHelpText.ThirdRow")}</p>
                            </div>
                        )}
                    </div>
                    <div className="zapin-body">
                        <div className="zapin-body-header">
                            <BondLogo bondLogoPath="path" isLP={false} />

                            <div className="zapin-body-header-name">
                                <p>{t("bond:TXSettings")}</p>
                            </div>
                        </div>
                        <div className="zapin-body-params">
                            <div className="data-row">
                                <p className="data-row-name">{t("bond:DestinationToken")}</p>
                                <p className="data-row-value">{bond.displayName}</p>
                            </div>
                            <div className="data-row">
                                <p className="data-row-name">{t("bond:SlippageTolerance")}</p>
                                <p className="data-row-value">{trim(slippage)}%</p>
                            </div>
                            <div className="data-row">
                                <p className="data-row-name">{t("YourBalance")}</p>
                                <p className="data-row-value">{`${trim(token.balance, 6)} ${token.name}`}</p>
                            </div>
                            <div className="data-row">
                                <p className="data-row-name">{t("bond:MinimumReceivedAmount")}</p>
                                <p className="data-row-value">{isLoading ? <Skeleton width="100px" /> : `${minimumReceivedAmount} ${bond.displayUnits}`}</p>
                            </div>
                            <div className="data-row">
                                <p className="data-row-name">{t("bond:ApproximatelyYouWillGet")}</p>
                                <p className="data-row-value">{isLoading ? <Skeleton width="100px" /> : `~ ${trim(bond.bondQuote, 4)} BASH`}</p>
                            </div>
                            <div className="data-row">
                                <p className="data-row-name">{t("bond:MaxYouCanBuy")}</p>
                                <p className="data-row-value">{isLoading ? <Skeleton width="100px" /> : `${trim(bond.maxBondPrice, 4)} BASH`}</p>
                            </div>
                            <div className="data-row">
                                <p className="data-row-name">{t("ROI")}</p>
                                <p className="data-row-value">{isLoading ? <Skeleton width="100px" /> : `${trim(bond.bondDiscount * 100, 2)}%`}</p>
                            </div>
                            <div className="data-row">
                                <p className="data-row-name">{t("bond:MinimumPurchase")}</p>
                                <p className="data-row-value">0.01 BASH</p>
                            </div>
                            {recipientAddress !== address && (
                                <div className="data-row">
                                    <p className="data-row-name">{t("bond:Recipient")}</p>
                                    <p className="data-row-value">{shorten(recipientAddress)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <ChooseToken open={chooseTokenOpen} handleClose={handleChooseTokenClose} handleSelect={handleChooseTokenSelect} bond={bond} />
                    <AdvancedSettings
                        open={settingsOpen}
                        handleClose={handleSettingsClose}
                        slippage={slippage}
                        recipientAddress={recipientAddress}
                        onRecipientAddressChange={onRecipientAddressChange}
                        onSlippageChange={onSlippageChange}
                    />
                </Box>
            </Paper>
        </Modal>
    );
}

export default Zapin;
