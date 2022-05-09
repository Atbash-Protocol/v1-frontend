import * as React from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { useSafeSigner } from 'contexts/web3/web3.hooks';
import { selectBASHBalance, selectSBASHBalance, selectUserStakingAllowance } from 'store/modules/account/account.selectors';
import { approveContract, stakeAction } from 'store/modules/stake/stake.thunks';
import { StakeActionEnum } from 'store/modules/stake/stake.types';
import { TransactionTypeEnum } from 'store/modules/transactions/transactions.type';

import AmountForm from '../AmountForm';

enum PanelEnum {
    STAKE = 0,
    UNSTAKE = 1,
}
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

export default function Stake() {
    const dispatch = useDispatch();
    const [value, setValue] = React.useState(PanelEnum.STAKE);
    const { t } = useTranslation();

    const { signer, signerAddress } = useSafeSigner();

    const BASHBalance = useSelector(selectBASHBalance);
    const SBASHBalance = useSelector(selectSBASHBalance);
    const { BASHAllowanceNeeded, SBASHAllowanceNeeded } = useSelector(selectUserStakingAllowance);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        event.preventDefault();
        setValue(newValue);
    };

    const handleStakingClick = React.useCallback((amount: number) => {
        switch (value) {
            case PanelEnum.STAKE:
                return dispatch(stakeAction({ action: StakeActionEnum.STAKE, amount, signer, signerAddress }));
            case PanelEnum.UNSTAKE:
                return dispatch(stakeAction({ action: StakeActionEnum.UNSTAKE, amount, signer, signerAddress }));
            default:
                throw new Error('This mode is not handlded');
        }
    }, []);

    const handleApproveClick = React.useCallback(
        (target: string) => {
            dispatch(approveContract({ signer, signerAddress, target }));
        },
        [signer],
    );

    const StakeCard = (
        <AmountForm
            initialValue={0}
            maxValue={BASHBalance}
            transactionType={TransactionTypeEnum.BASH_APPROVAL}
            approvesNeeded={BASHAllowanceNeeded}
            onApprove={handleApproveClick}
            onAction={handleStakingClick}
            approveLabel={t('stake:ApproveStaking')}
            actionLabel={t('stake:Stake')}
        />
    );

    const UnstakeCard = (
        <AmountForm
            initialValue={SBASHBalance}
            maxValue={SBASHBalance}
            transactionType={TransactionTypeEnum.SBASH_APPROVAL}
            approvesNeeded={SBASHAllowanceNeeded}
            onApprove={handleApproveClick}
            onAction={handleStakingClick}
            approveLabel={t('stake:ApproveUnstaking')}
            actionLabel={t('stake:Unstake')}
        />
    );

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs centered value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label={<>{t('stake:Stake')}</>} {...a11yProps(0)} />
                <Tab label={<>{t('stake:Unstake')}</>} {...a11yProps(1)} />
            </Tabs>
            <TabPanel value={value} index={0}>
                {StakeCard}
            </TabPanel>
            <TabPanel value={value} index={1}>
                {UnstakeCard}
            </TabPanel>
        </Box>
    );
}
