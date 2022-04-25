import './console-interceptor';

import { useEffect } from 'react';

import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';

import { close, MessagesState } from 'store/slices/messages-slice';
import { IReduxState } from 'store/slices/state.interface';

// A component that displays error messages
function Messages() {
    const { enqueueSnackbar } = useSnackbar();
    const messages = useSelector<IReduxState, MessagesState>(state => state.messages);
    const dispatch = useDispatch();

    useEffect(() => {
        if (messages.message) {
            enqueueSnackbar(JSON.stringify(messages.message));
            dispatch(close());
        }
    }, [messages.message]);

    return null;
}

export default Messages;
