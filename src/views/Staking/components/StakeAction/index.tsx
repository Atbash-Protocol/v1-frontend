import { useCallback, useMemo } from 'react';

import { t } from 'i18next';
import { useDispatch, useSelector } from 'react-redux';

import { useSafeSigner } from 'contexts/web3/web3.hooks';
import { selectBASHBalance, selectUserStakingAllowance } from 'store/modules/account/account.selectors';
import { approveContract, stakeAction } from 'store/modules/stake/stake.thunks';
import { StakeActionEnum } from 'store/modules/stake/stake.types';
import { selectStakingPending } from 'store/modules/transactions/transactions.selectors';
import { TransactionType, TransactionTypeEnum } from 'store/modules/transactions/transactions.type';
import AmountForm from 'views/Staking/components/AmountForm';

const StakeCard = () => {
    const dispatch = useDispatch();

    const BASHBalance = useSelector(selectBASHBalance);

    const translactionPending = useSelector(selectStakingPending);
    const { BASHAllowanceNeeded } = useSelector(selectUserStakingAllowance);
    const { signer, signerAddress } = useSafeSigner();

    const handleStakingClick = useCallback((amount: number) => {
        return dispatch(stakeAction({ action: StakeActionEnum.STAKE, amount, signer, signerAddress }));
    }, []);

    const handleApproveClick = useCallback(
        (transactionType: TransactionType) => {
            dispatch(approveContract({ signer, signerAddress, transactionType }));
        },
        [signer],
    );

    return (
        <AmountForm
            initialValue={0}
            maxValue={BASHBalance.toNumber()}
            transactionType={TransactionTypeEnum.BASH_APPROVAL}
            approvesNeeded={BASHAllowanceNeeded}
            onApprove={handleApproveClick}
            onAction={handleStakingClick}
            approveLabel={t('stake:ApproveStaking')}
            actionLabel={t('stake:Stake')}
            isLoading={translactionPending}
        />
    );
};

export { StakeCard };
