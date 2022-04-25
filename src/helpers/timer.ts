import { DurationObjectUnits, DateTime } from 'luxon';

export const getDateDiff = (startDate: number, endDate: number): DurationObjectUnits | null => {
    const { isValid, ...units } = DateTime.fromSeconds(endDate).diff(DateTime.fromSeconds(startDate), ['days', 'hours', 'minute', 'seconds']);

    if (!isValid) return null;

    return units;
};
