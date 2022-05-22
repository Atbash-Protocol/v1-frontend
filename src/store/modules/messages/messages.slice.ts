import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { messages } from 'constants/messages';

import { MessagesState, Message, NotificationMessage } from './messages.types';

const initialState: MessagesState = {
    notifications: [],
};

export const createNotification = ({ payload }: PayloadAction<Message>): NotificationMessage => {
    if (!['success', 'error', 'info', 'warning'].some(x => x === payload.severity)) {
        throw new Error('Not handled');
    }

    return { ...payload, display: true, id: Math.random().toString(36).substring(2, 15) };
};

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        addNotification(state, action: PayloadAction<Message>) {
            const notification = createNotification(action);
            state.notifications.push(notification);
        },
        closeNotification(state, action) {
            const notificationIdx = state.notifications.find(action.payload.id);

            if (notificationIdx) notificationIdx.display = false;
        },
    },
});

export const { addNotification } = messagesSlice.actions;

export default messagesSlice.reducer;

// actions
export const walletConnectWarning = addNotification({ severity: 'warning', description: messages.please_connect_wallet });
