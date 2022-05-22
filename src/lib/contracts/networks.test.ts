import { Network } from '@ethersproject/networks';

import { Networks } from 'constants/blockchain';

import { getProviderURL } from './networks';

describe('#getProviderURL', () => {
    it('throws if network is not included', () => {
        expect(() => getProviderURL(12345)).toThrowError(`Unable to get mainNetURI with network "12345"`);
    });

    it('throws if provider url is not defined', () => {
        (process.env as any).REACT_APP_INFURA_ENDPOINT_URL = '';

        expect(() => getProviderURL(1)).toThrowError('No provider endpoint url');
    });

    it('returns the url', () => {
        (process.env as any).REACT_APP_INFURA_ENDPOINT_URL = 'http://url';

        expect(getProviderURL(1)).toEqual('http://url');
    });
});
