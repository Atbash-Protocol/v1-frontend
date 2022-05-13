import axios from 'axios';
import { Dictionary, mapValues } from 'lodash';

const COINGECKO_ENDPOINT_URL = 'https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=';

export const getTokensPrice = async (tokens: string[]): Promise<Dictionary<number>> => {
    const url = COINGECKO_ENDPOINT_URL + [tokens].join(',');

    const { data } = await axios.get<{ [key: string]: { usd: number } }>(url, { timeout: 5000 });

    return mapValues(data, 'usd'); // { "<token1>": <price>, ...}
};
