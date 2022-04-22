import { JsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers";
import { Button } from "@mui/material";
import { useWeb3Context } from "hooks/web3";
import { useDispatch } from "react-redux";
import { approveBonds } from "store/modules/bonds/bonds.thunks";
import { BondItem } from "store/modules/bonds/bonds.types";

export const BondApprove = ({ bond }: { bond: BondItem }) => {
    const { provider } = useWeb3Context();
    const dispatch = useDispatch();

    const handleApprove = () => {
        dispatch(approveBonds({ provider: provider!, bond }));
    };

    return (
        <Button fullWidth onClick={handleApprove}>
            Approve bond
        </Button>
    );
};
