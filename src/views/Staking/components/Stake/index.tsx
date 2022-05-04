import * as React from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { BigNumber } from 'ethers';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { useSafeSigner } from 'contexts/web3/web3.hooks';
import { selectBASHBalance, selectSBASHBalance } from 'store/modules/account/account.selectors';
import { AccountSlice } from 'store/modules/account/account.types';
import { approveContract, stakeAction } from 'store/modules/stake/stake.thunks';
import { StakeActionEnum } from 'store/modules/stake/stake.types';
import { TransactionTypeEnum } from 'store/slices/pending-txns-slice';
import { IReduxState } from 'store/slices/state.interface';

import AmountForm from '../AmountForm';

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
                <Box sx={{ p: 3, color: 'red' }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `stake-tab-${index}`,
        'aria-controls': `stake-tabpanel-${index}`,
        sx: {
            color: 'white',
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

    const BASHBalance = useSelector(selectBASHBalance);
    const SBASHBalance = useSelector(selectSBASHBalance);
    const { stakingAllowance } = useSelector<IReduxState, Pick<AccountSlice, 'stakingAllowance'>>(state => state.accountNew, shallowEqual);

    const handleStakingClick = React.useCallback((amount: number) => {
        dispatch(stakeAction({ action: StakeActionEnum.STAKE, amount, signer, signerAddress }));
    }, []);

    const handleApproveClick = React.useCallback(
        (target: string) => {
            dispatch(approveContract({ signer, signerAddress, target }));
        },
        [signer],
    );

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs centered value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label={<>{t('stake:Stake')}</>} {...a11yProps(0)} />
                <Tab label={<>{t('stake:Unstake')}</>} {...a11yProps(1)} />
            </Tabs>
            <TabPanel value={value} index={0}>
                <AmountForm
                    initialValue={0}
                    maxValue={BASHBalance}
                    transactionType={TransactionTypeEnum.BASH_APPROVAL}
                    approvesNeeded={stakingAllowance.BASH.eq(BigNumber.from(0))}
                    onApprove={handleApproveClick}
                    onAction={handleStakingClick}
                    approveLabel={t('stake:ApproveStaking')}
                    actionLabel={t('stake:Stake')}
                />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <AmountForm
                    initialValue={SBASHBalance}
                    maxValue={SBASHBalance}
                    transactionType={TransactionTypeEnum.SBASH_APPROVAL}
                    approvesNeeded={stakingAllowance.SBASH.eq(BigNumber.from(0))}
                    onApprove={handleApproveClick}
                    onAction={handleStakingClick}
                    approveLabel={t('stake:ApproveUnstaking')}
                    actionLabel={t('stake:Unstake')}
                />
            </TabPanel>
        </Box>
    );
}
