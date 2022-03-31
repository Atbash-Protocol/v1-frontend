import axios from "axios";

const COINGECKO_ENDPOINT_URL = "https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=";

export const getTokensPrice = async (tokens: string[]): Promise<Record<string, number>[]> => {
    const url = COINGECKO_ENDPOINT_URL + tokens.join(",");

    const { data } = await axios.get<{ [key: string]: { usd: number } }>(url);

    return Object.entries(data).map(([key, { usd }]) => {
        return {
            [key]: usd,
        };
    });
};
