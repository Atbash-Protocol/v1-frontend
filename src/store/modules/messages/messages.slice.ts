import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { messages } from 'constants/messages';

import { MessagesState, Message } from './messages.types';

const initialState: MessagesState = {
    notifications: [],
};

export const createNotification = ({ payload }: PayloadAction<Message>) => {
    if (!['success', 'error', 'info', 'warning'].some(x => x === payload.severity)) {
        throw new Error('Not handled');
    }

    return payload;
};

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        addNotification(state, action: PayloadAction<Message>) {
            const notification = createNotification(action);
            state.notifications.push(notification);
        },
    },
});

export const { addNotification } = messagesSlice.actions;

export default messagesSlice.reducer;

// actions
export const walletConnectWarning = addNotification({ severity: 'warning', description: messages.please_connect_wallet });
