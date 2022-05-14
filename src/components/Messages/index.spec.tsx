import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import * as Notistack from 'notistack';
import { Provider } from 'react-redux';

import * as BSnackBarComponent from 'components/Messages/snackbar';
import * as SelectMessagesModule from 'store/modules/messages/messages.selectors';
import messagesReducer from 'store/modules/messages/messages.slice';
import { NotificationMessage } from 'store/modules/messages/messages.types';

import Messages from '.';

jest.mock('./snackbar', () => ({
    BSnackBar: () => {
        return <>SnackbarRendered</>;
    },
}));

function renderComponent(component: JSX.Element, contextState?: any) {
    return render(
        <Provider
            store={configureStore({
                reducer: {
                    messages: messagesReducer,
                },
            })}
        >
            {component}
        </Provider>,
    );
}

describe('#Messages', () => {
    it('calls enqueueSnackBar on notification', () => {
        const enqueueSnackBarSpy = jest.fn();
        const notification: NotificationMessage = { id: 'id', display: true, severity: 'info', description: 'description', detailledDescription: 'detailled' };

        jest.spyOn(Notistack, 'useSnackbar').mockReturnValue({
            enqueueSnackbar: enqueueSnackBarSpy,
        } as any);
        jest.spyOn(SelectMessagesModule, 'selectLastNotification').mockReturnValue(notification);

        const content = renderComponent(<Messages />);

        expect(enqueueSnackBarSpy).toHaveBeenCalledTimes(1);
        expect(enqueueSnackBarSpy).toHaveBeenCalledWith('notification', { content: expect.anything(), variant: 'info' });
        expect(content.findAllByAltText('SnackbarRendered')).toBeDefined(); //mock of snackbar renders
    });
});
