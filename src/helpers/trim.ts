import fromExponential from 'from-exponential';

export const trim = (number = 0, precision?: number) => {
    const [exp, decimals] = fromExponential(number).split('.');

    if (!decimals) return exp;

    return [exp, decimals.substring(0, precision)].join('.');
};

export const trimString = (numberInGWEI: string) => {
    return Number(numberInGWEI).toFixed(2);
};
