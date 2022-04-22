import { ExternalProvider, JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { DEFAULT_NETWORK } from "constants/blockchain";
import { getProviderURI } from "lib/web3/web3.utils";
import { Dispatch } from "react";
import { WEB3ContextAction, WEB3ActionTypesEnum } from "./web3.types";

export const subscribeSigner = async (web3provider: any, dispatch: Dispatch<WEB3ContextAction>) => {
    const signer = new Web3Provider(web3provider).once("close", () => {
        dispatch({ type: WEB3ActionTypesEnum.CLOSE, payload: { signer } });
    });

    web3provider.on("networkChanged", async (networkId: number) => {
        dispatch({ type: WEB3ActionTypesEnum.NETWORK_CHANGED, payload: { signer, networkId } });
    });

    try {
        const [{ chainId }, address] = await Promise.all([signer.getNetwork(), signer.getSigner().getAddress()]);

        console.log("address", address);
        dispatch({ type: WEB3ActionTypesEnum.SET_SIGNER, payload: { signer, chainId, address } });
    } catch (err) {
        console.error(err);
    }
};

export const subscribeProvider = async (dispatch: Dispatch<WEB3ContextAction>) => {
    const provider = new JsonRpcProvider(getProviderURI(DEFAULT_NETWORK)).on("error", err => {
        alert("provider error");
        console.error(err);
    });

    try {
        const { chainId } = await provider.ready;

        if (!chainId) throw new Error("Impossible to connect to the given provider");

        dispatch({ type: WEB3ActionTypesEnum.SET_PROVIDER, payload: { chainId, provider } });
    } catch (err) {
        console.error("Provider error");
    }
};
