import { DateTime } from 'luxon';

import { getDateDiff } from 'helpers/timer';

describe('#getDateDiff', () => {
    it('returns the units', () => {
        expect(getDateDiff(DateTime.utc().toSeconds(), DateTime.utc().plus({ days: 1, hours: 2, minutes: 0 }).toSeconds())).toStrictEqual(
            expect.objectContaining({
                days: 1,
                hours: 2,
                minutes: expect.any(Number),
            }),
        );
    });
});
