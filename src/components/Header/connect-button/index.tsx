import { useCallback, useContext, useEffect, useState } from 'react';

import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { theme } from 'constants/theme';
import { Web3Context } from 'contexts/web3/web3.context';
import { useSignerConnected, useGoodNetworkCheck } from 'contexts/web3/web3.hooks';
import { selectTransactionPending } from 'store/modules/transactions/transactions.selectors';

function ConnectMenu() {
    const { t } = useTranslation();
    const { memoConnect, memoDisconnect, state } = useContext(Web3Context);

    const isUserSigned = useSignerConnected();

    const isUserOnGoodNetwork = useGoodNetworkCheck();

    const isOneTransactionPending = useSelector(selectTransactionPending);

    const handleButtonClick = useCallback(() => {
        return isUserSigned ? memoDisconnect(state.signer) : memoConnect();
    }, [isUserSigned, memoConnect, memoDisconnect]);

    const [buttonText, setButtonText] = useState(t('ConnectWallet'));

    useEffect(() => {
        if (isUserSigned) {
            if (!isUserOnGoodNetwork) {
                setButtonText(t('WrongNetwork'));
            } else if (isOneTransactionPending) {
                setButtonText(t('CountPending', { count: 1 })); // Ususally user can't have more than 1
            } else {
                setButtonText(t('Disconnect'));
            }
        }
    }, [isUserSigned, isOneTransactionPending, isUserOnGoodNetwork]);

    return (
        <Box>
            <Button
                sx={{
                    background: isUserSigned && !isUserOnGoodNetwork ? 'red !important' : 'rgba(255, 255, 255, 0.9)',
                    boxShadow: '0px 0px 10px rgba(44, 39, 109, 0.1)',
                    padding: theme.spacing(1),
                }}
                onClick={handleButtonClick}
            >
                <>{buttonText}</>
            </Button>
        </Box>
    );
}

export default ConnectMenu;
