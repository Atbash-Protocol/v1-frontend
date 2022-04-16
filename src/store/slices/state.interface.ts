import { IPendingTxn } from "./pending-txns-slice";
import { IAccountSlice } from "./account-slice";
import { IAppSlice } from "./app-slice";
import { IBondSlice } from "./bond-slice";
import { MessagesState } from "./messages-slice";
import { MainSliceState } from "store/modules/app/app.types";
import { MarketSlice } from "store/modules/markets/markets.type";
import { AccountSlice } from "store/modules/account/account.types";
import { BondSlice } from "store/modules/bonds/bonds.types";

export interface IReduxState {
    pendingTransactions: IPendingTxn[];
    account: IAccountSlice;
    app: IAppSlice;
    bonding: IBondSlice;
    messages: MessagesState;
    main: MainSliceState;
    markets: MarketSlice;
    accountNew: AccountSlice;
    bonds: BondSlice;
}
