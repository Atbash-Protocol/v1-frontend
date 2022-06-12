import { AccountSlice } from 'store/modules/account/account.types';
import { MainSliceState } from 'store/modules/app/app.types';
import { BondSlice } from 'store/modules/bonds/bonds.types';
import { MarketSlice } from 'store/modules/markets/markets.type';
import { MessagesState } from 'store/modules/messages/messages.types';
import { Transaction } from 'store/modules/transactions/transactions.type';

export interface IReduxState {
    transactions: Transaction[];
    messages: MessagesState;
    main: MainSliceState;
    markets: MarketSlice;
    account: AccountSlice;
    bonds: BondSlice;
}
