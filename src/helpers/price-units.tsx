import { SvgIcon } from "@material-ui/core";
import fromExponential from "from-exponential";

import { ReactComponent as ETHImg } from "../assets/tokens/ETH.svg";
import { IAllBondData } from "../hooks/bonds";
import { dai } from "../helpers/bond";

export const priceUnits = (bond: IAllBondData) => {
    if (bond.name === dai.name) return <SvgIcon component={ETHImg} viewBox="0 0 32 32" style={{ height: "15px", width: "15px" }} />;

    return "$";
};

export const formatUSD = (value: number, digits: number = 0): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: digits,
        minimumFractionDigits: digits,
    }).format(value);
};

export const formatNumber = (number: number = 0, precision?: number) => {
    const [exp, decimals] = fromExponential(number).split(".");

    if (!decimals || !precision) return exp;

    return [exp, decimals.substring(0, precision)].join(".");
};
