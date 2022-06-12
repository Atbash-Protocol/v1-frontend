import Web3Modal from 'web3modal';

import { Networks } from 'constants/blockchain';

import { initWeb3Modal, getProviderURI } from '../web3.utils';
import * as WEB3UtilsModule from '../web3.utils';

describe('#initWeb3Modal', () => {
    it('returns the modal', () => {
        const web3modal = initWeb3Modal();

        expect(web3modal).toBeInstanceOf(Web3Modal);
    });
});

describe('#getProviderURI', () => {
    it('throws an error if the rpc url cant be found', () => {
        (process.env as any).REACT_APP_NETWORK_RPC_URL = '';

        expect(() => getProviderURI(Networks.LOCAL)).toThrow('Network RPC URL not defined');
    });

    it('returns the url', () => {
        const url = 'http://url';
        (process.env as any).REACT_APP_NETWORK_RPC_URL = url;

        expect(getProviderURI(Networks.LOCAL)).toBe(url);
    });
});
