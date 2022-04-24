import { Button } from "@mui/material";
import { useSafeSigner } from "lib/web3/web3.hooks";
import { useDispatch } from "react-redux";
import { BondItem } from "store/modules/bonds/bonds.types";

export const BondQuote = ({ bond }: { bond: BondItem }) => {
    const { signer } = useSafeSigner();
    const dispatch = useDispatch();

    const handleApprove = () => {
        // dispatch(approveBonds({ signer, bond }));
    };

    return (
        <Button fullWidth onClick={handleApprove}>
            Approve bond
        </Button>
    );
};
