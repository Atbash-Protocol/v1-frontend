import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { useSafeSigner } from 'contexts/web3/web3.hooks';
import { selectSBASHBalance, selectUserStakingAllowance } from 'store/modules/account/account.selectors';
import { addNotification } from 'store/modules/messages/messages.slice';
import { selectWrappingPending } from 'store/modules/transactions/transactions.selectors';
import { TransactionTypeEnum } from 'store/modules/transactions/transactions.type';
import { approveWrapContract, wrapAction } from 'store/modules/wrap/wrap.thunks';
import AmountForm from 'views/Staking/components/AmountForm';

export const WrapAction = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const SBASHBalance = useSelector(selectSBASHBalance);
    const { WSBASHAllowanceNeeded } = useSelector(selectUserStakingAllowance);
    const translactionPending = useSelector(selectWrappingPending);

    const { signer } = useSafeSigner();

    const handleApproveClick = () => {
        dispatch(approveWrapContract({ signer }));
    };

    const handleWrappingClick = (amount: number) => {
        if (amount > 0) {
            dispatch(wrapAction({ signer, amount, type: TransactionTypeEnum.WRAPPING }));
        } else {
            dispatch(addNotification({ severity: 'error', description: t('wrap:ProvideAmount') }));
        }
    };

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
