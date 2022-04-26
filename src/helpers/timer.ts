import { DurationObjectUnits, DateTime } from 'luxon';

export const getDateDiff = (startDate: number, endDate: number): DurationObjectUnits | null => {
    const { ...units } = DateTime.fromSeconds(endDate).diff(DateTime.fromSeconds(startDate), ['days', 'hours', 'minute', 'seconds']);

    return units;
};
