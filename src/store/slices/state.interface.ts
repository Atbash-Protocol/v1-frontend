import { AccountSlice } from 'store/modules/account/account.types';
import { MainSliceState } from 'store/modules/app/app.types';
import { BondSlice } from 'store/modules/bonds/bonds.types';
import { MarketSlice } from 'store/modules/markets/markets.type';

import { MessagesState } from './messages-slice';
import { IPendingTxn } from './pending-txns-slice';

export interface IReduxState {
    pendingTransactions: IPendingTxn[];
    messages: MessagesState;
    main: MainSliceState;
    markets: MarketSlice;
    account: AccountSlice;
    bonds: BondSlice;
}
