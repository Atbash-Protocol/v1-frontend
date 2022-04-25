import { ActiveTokensEnum } from 'config/tokens';

export interface MarketSlice {
    markets: { [ActiveTokensEnum.DAI]: number | null };
    loading: boolean;
}
