import fromExponential from 'from-exponential';

export const formatUSD = (value: number, digits = 0): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: digits,
        minimumFractionDigits: digits,
    }).format(value);
};

export const formatNumber = (number = 0, precision?: number) => {
    const [exp, decimals] = fromExponential(number).split('.');

    if (!decimals || !precision) return exp;

    return [exp, decimals.substring(0, precision)].join('.');
};

export const formatAPY = (formatted: string): string => {
    return formatted.length > 16 ? '> 1 000 000 %' : formatted;
};
