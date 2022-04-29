import { DurationObjectUnits, DateTime } from 'luxon';

export const getDateDiff = (startDate: number, endDate: number): DurationObjectUnits | null => {
    console.log(DateTime.fromSeconds(endDate).diff(DateTime.fromSeconds(startDate), ['days', 'hours', 'minute', 'seconds']));
    const { isValid, days, hours, minutes } = DateTime.fromSeconds(endDate).diff(DateTime.fromSeconds(startDate), ['days', 'hours', 'minute', 'seconds']);

    if (!isValid) throw new Error('Invalid date');

    return { days, hours, minutes };
};
