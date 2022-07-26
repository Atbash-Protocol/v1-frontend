import MessageReducer, { addNotification, closeNotification, createNotification } from '../messages.slice';

describe('#createNotification', () => {
    it('throws an error if the severity is not handled', () => {
        expect(() => createNotification({ payload: { severity: 'unknown' } } as any)).toThrow();
    });

    it('creates a notification', () => {
        const notificationBody = { payload: { description: 'error', detailledDescription: 'detailledDescription', severity: 'success' }, type: 'red' };

        const notification = createNotification(notificationBody as any);

        expect(notification).toEqual({ ...notificationBody.payload, display: true, id: expect.any(String) });
    });
});

describe('MessageReducer', () => {
    const initialState = {
        notifications: [],
    };

    describe('#addNotification', () => {
        it('process a notification', () => {
            const action = { type: 'error', payload: { message: 'error' }, severity: 'error' };
            const state = MessageReducer(initialState, addNotification(action as any));

            expect(state.notifications).toEqual([
                {
                    display: true,
                    id: expect.any(String),
                    payload: {
                        message: 'error',
                    },
                    severity: 'error',
                    type: 'error',
                },
            ]);
        });
    });
    describe('#closeNotification', () => {
        it('process a notification', () => {
            const firstError = { type: 'error', payload: { message: 'error' }, severity: 'error' };
            const firstState = MessageReducer(initialState, addNotification(firstError as any));

            const action = { id: firstState.notifications[0].id };
            const state = MessageReducer(firstState, closeNotification(action));

            expect(state).toEqual({
                ...initialState,
                notifications: [
                    {
                        display: false,
                        id: expect.any(String),
                        payload: {
                            message: 'error',
                        },
                        severity: 'error',
                        type: 'error',
                    },
                ],
            });
        });
    });
});
