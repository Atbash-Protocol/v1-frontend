import { AnyAction, Action } from '@reduxjs/toolkit';

interface RejectedAction extends Action {
    error: Error;
}

export const isActionRejected = (action: AnyAction): action is RejectedAction => {
    return action.type.toString().endsWith('rejected');
};
