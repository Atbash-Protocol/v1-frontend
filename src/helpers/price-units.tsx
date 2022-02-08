import { SvgIcon } from "@material-ui/core";
import { ReactComponent as MimImg } from "../assets/tokens/MIM.svg";
import { IAllBondData } from "../hooks/bonds";

export const priceUnits = (bond: IAllBondData) => {
    return "$";
};
