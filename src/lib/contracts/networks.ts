import { isEmpty, isUndefined } from 'lodash';

import { Networks } from 'constants/blockchain';

export const getProviderURL = (networkId: number): string => {
    if (![Networks.MAINNET, Networks.RINKEBY, Networks.LOCAL].includes(networkId)) throw new Error(`Unable to get mainNetURI with network "${networkId}"`);

    const url = process.env.REACT_APP_INFURA_ENDPOINT_URL;

    if (isUndefined(url) || isEmpty(url)) {
        throw new Error('No provider endpoint url');
    }

    return url;
};
