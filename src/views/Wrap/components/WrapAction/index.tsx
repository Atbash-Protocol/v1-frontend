import { Box } from '@mui/material';
import { t } from 'i18next';
import { useSelector } from 'react-redux';

import { selectSBASHBalance, selectUserStakingAllowance } from 'store/modules/account/account.selectors';
import { selectWrappingPending } from 'store/modules/transactions/transactions.selectors';
import { TransactionTypeEnum } from 'store/modules/transactions/transactions.type';
import AmountForm from 'views/Staking/components/AmountForm';

export const WrapAction = () => {
    const SBASHBalance = useSelector(selectSBASHBalance);
    const { WSBASHAllowanceNeeded } = useSelector(selectUserStakingAllowance);
    const translactionPending = useSelector(selectWrappingPending);

    const handleApproveClick = () => {};

    const handleWrappingClick = () => {};

    return (
        <Box>
            <AmountForm
                initialValue={0}
                maxValue={SBASHBalance.toNumber()}
                transactionType={TransactionTypeEnum.WRAPPING}
                approvesNeeded={WSBASHAllowanceNeeded}
                onApprove={handleApproveClick}
                onAction={handleWrappingClick}
                approveLabel={t('wrap:ApproveWrapping')}
                actionLabel={t('wrap:Wrap')}
                isLoading={translactionPending}
            />

            {WSBASHAllowanceNeeded && <>{t('wrap:ApproveNote')}</>}
        </Box>
    );
};
