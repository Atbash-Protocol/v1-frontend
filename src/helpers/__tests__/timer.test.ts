import { getDateDiff } from "helpers/timer";
import { DateTime } from "luxon";

describe("#getDateDiff", () => {
    it.skip("returns nunll with a wrong date", () => {
        expect(getDateDiff(DateTime.utc().toSeconds(), DateTime.utc().minus({ hours: 2 }).toSeconds())).toBe(null);
    });
});
