import { JsonRpcBatchProvider, JsonRpcProvider } from "@ethersproject/providers";
import { BigNumber, ethers } from "ethers";
import { hexlify } from "ethers/lib/utils";
import { getGasPrice } from "helpers/get-gas-price";

describe("#GetGasPrice", () => {
    it("returns a gas price plus a default value", async () => {
        const provider = {
            getGasPrice: jest.fn().mockResolvedValue(ethers.utils.parseUnits("10", "gwei")),
        };

        await expect(getGasPrice(provider as unknown as JsonRpcProvider)).resolves.toStrictEqual(ethers.utils.parseUnits("15", "gwei"));
    });
});
