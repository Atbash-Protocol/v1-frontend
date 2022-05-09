import { useEffect } from 'react';

import { SnackbarKey, useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';

import { MessagesState } from 'store/modules/messages/messages.types';
import { IReduxState } from 'store/slices/state.interface';

import { BSnackBar } from './snackbar';

// A component that displays error messages
function Messages() {
    const { enqueueSnackbar } = useSnackbar();
    const notifications = useSelector<IReduxState, MessagesState['notifications']>(state => state.messages.notifications);

    useEffect(() => {
        if (notifications && notifications.length > 0) {
            enqueueSnackbar('notif', {
                variant: 'error',
                content: (key: SnackbarKey) => {
                    return <BSnackBar key={key} description={notifications[0].description} severity={notifications[0].severity} />;
                },
            });
        }
    }, [notifications]);

    return null;
}

export default Messages;
