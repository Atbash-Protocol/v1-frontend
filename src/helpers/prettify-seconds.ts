import { TFunction } from "i18next";
import { DateTime, Duration, DurationObjectUnits } from "luxon";
import i18n from "../i18n";

export const prettifySeconds = (seconds?: number, resolution?: string) => {
    if (seconds !== 0 && !seconds) {
        return "";
    }

    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);

    if (resolution === "day") {
        return d + ` ${i18n.t("day", { count: d })}`;
    }

    const dDisplay = d > 0 ? d + ` ${i18n.t("day", { count: d })}, ` : "";
    const hDisplay = h > 0 ? h + ` ${i18n.t("hour", { count: h })}, ` : "";
    const mDisplay = m > 0 ? m + ` ${i18n.t("min", { count: m })}` : "";

    return dDisplay + hDisplay + mDisplay;
};

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
