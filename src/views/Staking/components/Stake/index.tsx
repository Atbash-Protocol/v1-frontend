import * as React from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { BigNumber } from 'ethers';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { useSafeSigner } from 'lib/web3/web3.hooks';
import { selectStakeBalanceAndAllowances } from 'store/modules/account/account.selectors';
import { stakeAction } from 'store/modules/contracts/contracts.thunks';
import { StakeActionEnum } from 'store/modules/contracts/contracts.types';
import { approveContract } from 'store/modules/stake/stake.thunks';
import { TransactionTypeEnum } from 'store/slices/pending-txns-slice';

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
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs centered value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label={t('stake:Stake')} {...a11yProps(0)} />
                <Tab label={t('stake:Unstake')} {...a11yProps(1)} />
            </Tabs>
            <TabPanel value={value} index={0}>
                <AmountForm
                    initialValue={0}
                    maxValue={balances.BASH}
                    transactionType={TransactionTypeEnum.BASH_APPROVAL}
                    approvesNeeded={stakingAllowance.BASH.eq(BigNumber.from(0))}
                    onApprove={handleApproveClick}
                    onAction={handleStakingClick}
                    approveLabel={t('stake:ApproveStaking')}
                    actionLabel={t('stake:Staking')}
                />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <AmountForm
                    initialValue={balances.SBASH}
                    maxValue={balances.SBASH}
                    transactionType={TransactionTypeEnum.SBASH_APPROVAL}
                    approvesNeeded={stakingAllowance.SBASH.eq(BigNumber.from(0))}
                    onApprove={handleApproveClick}
                    onAction={handleStakingClick}
                    approveLabel={t('stake:ApproveUnstaking')}
                    actionLabel={t('stake:Unstaking')}
                />
            </TabPanel>
        </Box>
    );
}
