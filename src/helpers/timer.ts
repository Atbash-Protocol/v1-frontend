import { TFunction } from "i18next";
import { DurationObjectUnits, DateTime } from "luxon";

type FormatDurationUnitContext = {};

const LuxonI18NMapping = {
    days: "day",
    hours: "hour",
    minutes: "min",
};

export const getDateDiff = (startDate: number, endDate: number): DurationObjectUnits | null => {
    const { isValid, ...units } = DateTime.fromSeconds(endDate).diff(DateTime.fromSeconds(startDate), ["days", "hours", "minute", "seconds"]);

    if (!isValid) return null;

    return units;
};
export const formatDurationUnits = (
    units: DurationObjectUnits,
    translator: TFunction,
    context: { unitsToPick: string[] } = { unitsToPick: ["days", "hours", "minute", "seconds"] },
): string | null => {
    // context.unitsToPick.map( (unit) => {
    //   if(units[unit] )
    // })

    // if (days) translations.push(translator("day", { count: days }));

    // translations.push(translator("hour", { count: hours }));
    // translations.push(translator("min", { count: minutes }));
    const translations: string[] = [];
    const seconds = 0;

    return [...translations, `${seconds} s`].join(" ");
};
