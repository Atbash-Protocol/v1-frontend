import { TFunction } from "i18next";
import { DurationObjectUnits, DateTime } from "luxon";

export const getDateDiff = (startDate: number, endDate: number): DurationObjectUnits | null => {
    const { isValid, ...units } = DateTime.fromSeconds(endDate).diff(DateTime.fromSeconds(startDate), ["days", "hours", "minute", "seconds"]);

    if (!isValid) return null;

    return units;
};
export const formatTimer = (startDate: number, endDate: number, translator: TFunction): string | null => {
    if (startDate > endDate) return null;

    const { days, hours, minutes, seconds } = DateTime.fromSeconds(endDate).diff(DateTime.fromSeconds(startDate), ["days", "hours", "minute", "seconds"]);

    const translations = [];

    if (days) translations.push(translator("day", { count: days }));

    translations.push(translator("hour", { count: hours }));
    translations.push(translator("min", { count: minutes }));

    return [...translations, `${seconds} s`].join(" ");
};
