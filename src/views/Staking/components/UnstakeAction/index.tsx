import { useCallback, useMemo } from 'react';

import { t } from 'i18next';
import { useDispatch, useSelector } from 'react-redux';

import { useSafeSigner } from 'contexts/web3/web3.hooks';
import { selectSBASHBalance, selectUserStakingAllowance } from 'store/modules/account/account.selectors';
import { approveContract, stakeAction } from 'store/modules/stake/stake.thunks';
import { StakeActionEnum } from 'store/modules/stake/stake.types';
import { selectStakingPending } from 'store/modules/transactions/transactions.selectors';
import { TransactionType, TransactionTypeEnum } from 'store/modules/transactions/transactions.type';
import AmountForm from 'views/Staking/components/AmountForm';

const UnStakeCard = () => {
    const dispatch = useDispatch();

    const SBASHBalance = useSelector(selectSBASHBalance);

    const translactionPending = useSelector(selectStakingPending);
    const { SBASHAllowanceNeeded } = useSelector(selectUserStakingAllowance);
    const { signer, signerAddress } = useSafeSigner();

    const handleApproveClick = useCallback(
        (transactionType: TransactionType) => {
            dispatch(approveContract({ signer, signerAddress, transactionType }));
        },
        [signer],
    );

    const handleUnstakingClick = useCallback((amount: number) => {
        return dispatch(stakeAction({ action: StakeActionEnum.UNSTAKE, amount, signer, signerAddress }));
    }, []);

    return (
        <AmountForm
            initialValue={SBASHBalance.toNumber()}
            maxValue={SBASHBalance.toNumber()}
            transactionType={TransactionTypeEnum.SBASH_APPROVAL}
            approvesNeeded={SBASHAllowanceNeeded}
            onApprove={handleApproveClick}
            onAction={handleUnstakingClick}
            approveLabel={t('stake:ApproveUnstaking')}
            actionLabel={t('stake:Unstake')}
            isLoading={translactionPending}
        />
    );
};

export { UnStakeCard };
