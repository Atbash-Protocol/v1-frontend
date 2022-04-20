import { JsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { approveBonds } from "store/modules/bonds/bonds.thunks";
import { BondItem } from "store/modules/bonds/bonds.types";

export const BondApprove = ({ provider, bond }: { provider: JsonRpcProvider; bond: BondItem }) => {
    const dispatch = useDispatch();

    const handleApprove = () => {
        dispatch(approveBonds({ provider, bond }));
    };

    return (
        <Button fullWidth onClick={handleApprove}>
            Approve bond
        </Button>
    );
};
