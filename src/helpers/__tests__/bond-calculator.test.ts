import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "constants/blockchain";
import { ethers } from "ethers";
import { getBondCalculator } from "helpers/bond-calculator";

import * as ProviderModule from "@ethersproject/abstract-provider";

describe("#getBondCalculator", () => {
    it("returns the correct bond calculator", () => {
        jest.spyOn(ProviderModule.Provider, "isProvider").mockReturnValue(true);

        const calculator = getBondCalculator(Networks.LOCAL, {} as StaticJsonRpcProvider);

        expect(calculator).toBeInstanceOf(ethers.Contract);
        expect(calculator.address).toBe("0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6");
    });
});
