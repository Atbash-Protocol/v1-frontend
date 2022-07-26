import { TFunction } from 'i18next';
import { DateTime } from 'luxon';

export const formatTimer = (startDate: number, endDate: number, translator: TFunction): string | null => {
    if (startDate > endDate) return null;

    const { days, hours, minutes } = DateTime.fromSeconds(endDate).diff(DateTime.fromSeconds(startDate), ['days', 'hours', 'minute']);

    const translations = [];

    if (days) translations.push(translator('day', { count: days }));

    translations.push(translator('hour', { count: hours }));
    translations.push(translator('min', { count: Math.round(minutes) }));

    return [translator('approximativaly'), ...translations].join(' ');
};
