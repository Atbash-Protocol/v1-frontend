import { AlertColor } from '@mui/material';

export interface MessagesState {
    notifications: NotificationMessage[];
}

export interface NotificationMessage extends Message {
    id: string;
    display: boolean;
}

export interface Message {
    severity: AlertColor;
    description: string;
    detailledDescription?: string;
}
