import { JsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers";
import { Button } from "@mui/material";
import { useWeb3Context } from "hooks/web3";
import { useSafeSigner } from "lib/web3/web3.hooks";
import { useDispatch } from "react-redux";
import { approveBonds, calcBondDetails } from "store/modules/bonds/bonds.thunks";
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
