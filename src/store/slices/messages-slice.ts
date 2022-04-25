import { Color } from '@material-ui/lab/Alert';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { messages } from 'constants/messages';

export type Message = IMessage & {
    severity: Color;
};

export interface MessagesState {
    message: Message | null;
}

interface IMessage {
    text: string;
    error?: any;
}

// Adds a message to the store
const createMessage = function (state: MessagesState, severity: Color, text: IMessage) {
    const message: Message = {
        severity,
        ...text,
    };
    state.message = message;
};
const initialState: MessagesState = {
    message: null,
};
const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        // Creates an error message
        error(state, action: PayloadAction<IMessage>) {
            createMessage(state, 'error', action.payload);
        },
        // Creates an information message
        info(state, action: PayloadAction<IMessage>) {
            createMessage(state, 'info', action.payload);
        },
        warning(state, action: PayloadAction<IMessage>) {
            createMessage(state, 'warning', action.payload);
        },
        success(state, action: PayloadAction<IMessage>) {
            createMessage(state, 'success', action.payload);
        },
        // Closes a message
        close(state) {
            state.message = null;
        },
    },
});

export const { error, info, close, warning, success } = messagesSlice.actions;

export default messagesSlice.reducer;

// actions

export const walletConnectWarning = warning({ text: messages.please_connect_wallet });
export const successTransaction = success({ text: messages.tx_successfully_send });
