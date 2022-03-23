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
        expect(calculator.address).toBe("0xa513E6E4b8f2a923D98304ec87F64353C4D5C853");
    });
});
