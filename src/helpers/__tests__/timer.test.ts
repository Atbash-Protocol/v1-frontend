import { DateTime } from 'luxon';

import { getDateDiff } from 'helpers/timer';

describe('#getDateDiff', () => {
    it('returns the units', () => {
        expect(getDateDiff(DateTime.utc().toSeconds(), DateTime.utc().minus({ hours: 2 }).toSeconds())).toStrictEqual(
            expect.objectContaining({
                values: {
                    days: expect.any(Number),
                    hours: expect.any(Number),
                    minutes: expect.any(Number),
                    seconds: expect.any(Number),
                },
            }),
        );
    });
});
