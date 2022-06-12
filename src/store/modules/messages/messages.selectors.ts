import { RootState } from 'store/store';

export const selectLastNotification = (state: RootState) => state.messages.notifications.slice(-1)[0];
