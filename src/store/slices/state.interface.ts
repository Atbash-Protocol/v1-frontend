import { IPendingTxn } from "./pending-txns-slice";
import { MessagesState } from "./messages-slice";
import { MainSliceState } from "store/modules/app/app.types";
import { MarketSlice } from "store/modules/markets/markets.type";
import { AccountSlice } from "store/modules/account/account.types";
import { BondSlice } from "store/modules/bonds/bonds.types";

export interface IReduxState {
    pendingTransactions: IPendingTxn[];
    messages: MessagesState;
    main: MainSliceState;
    markets: MarketSlice;
    accountNew: AccountSlice;
    bonds: BondSlice;
}
