import { selectLastNotification } from '../messages.selectors';

describe('#selectLastNotification', () => {
    it('returns the last notification', () => {
        const state = { messages: { notifications: ['notification1', 'notification2'] } };

        expect(selectLastNotification(state as any)).toEqual('notification2');
    });
});
