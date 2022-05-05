import { AlertColor } from '@mui/material';

export interface MessagesState {
    notifications: Message[];
}

export interface Message {
    severity: AlertColor;
    description: string;
    detailledDescription?: string;
}
