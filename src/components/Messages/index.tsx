import { useEffect } from 'react';

import { SnackbarKey, useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';

import { selectLastNotification } from 'store/modules/messages/messages.selectors';

import { BSnackBar } from './snackbar';

// A component that displays error messages
function Messages() {
    const { enqueueSnackbar } = useSnackbar();
    const lastNotification = useSelector(selectLastNotification);

    useEffect(() => {
        if (lastNotification) {
            enqueueSnackbar('notification', {
                variant: lastNotification.severity,
                content: (key: SnackbarKey) => {
                    return (
                        <BSnackBar
                            key={key}
                            description={lastNotification.description}
                            severity={lastNotification.severity}
                            detailledDescription={JSON.stringify(lastNotification.detailledDescription)}
                        />
                    );
                },
            });
        }
    }, [lastNotification]);

    return null;
}

export default Messages;
