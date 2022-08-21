import AppReducer from '../app.slice';
import { getBlockchainData, getCoreMetrics, getStakingMetrics, initializeProviderContracts } from '../app.thunks';
import { MainSliceState, ContractEnum } from '../app.types';

const initialState: MainSliceState = {
    contracts: {
        [ContractEnum.BASH_CONTRACT]: null,
        [ContractEnum.SBASH_CONTRACT]: null,
        [ContractEnum.DAI_CONTRACT]: null,
        [ContractEnum.BASH_DAI_LP_ADDRESS]: null,
        [ContractEnum.STAKING_CONTRACT]: null,
        [ContractEnum.STAKING_HELPER_CONTRACT]: null,
        [ContractEnum.WSBASH_ADDRESS]: null,
        [ContractEnum.ZAPIN_ADDRESS]: null,
        [ContractEnum.REDEEM_CONTRACT]: null,
    },
    contractsLoaded: false,

    metrics: {
        circSupply: null,
        rawCircSupply: null,
        totalSupply: null,
        reserves: null,
        loading: true,
    },
    staking: {
        epoch: null,
        secondsToNextEpoch: null,
        index: null,
        loading: true,
    },
    blockchain: {
        timestamp: null,
        currentBlock: null,
        loading: true,
    },
    errorEncountered: false,
    loading: true,
};

describe('AppReducer', () => {
    describe('#initializeProviderContracts', () => {
        it('reduces pending', () => {
            const action = { type: initializeProviderContracts.pending, payload: {} };
            const state = AppReducer(initialState, action);

            expect(state).toEqual({ ...initialState, contractsLoaded: false });
        });

        it('reduces fullfilled', () => {
            const payload = { [ContractEnum.BASH_CONTRACT]: jest.fn() };
            const action = { type: initializeProviderContracts.fulfilled, payload };
            const state = AppReducer(initialState, action);

            expect(state).toEqual({ ...initialState, contractsLoaded: true, contracts: payload });
        });
    });

    describe('#getBlockchainData', () => {
        it('reduces fullfilled', () => {
            const payload = { currentBlock: 1 };
            const action = { type: getBlockchainData.fulfilled, payload };
            const state = AppReducer(initialState, action);

            expect(state).toEqual({ ...initialState, blockchain: { ...state.blockchain, currentBlock: 1, loading: false } });
        });
    });

    describe('#getCoreMetrics', () => {
        it('reduces fullfilled', () => {
            const payload = { circSupply: 1, rawCircSupply: 10, totalSupply: 10, reserves: 10, loading: true };
            const action = { type: getCoreMetrics.fulfilled, payload };
            const state = AppReducer(initialState, action);

            expect(state).toEqual({ ...initialState, metrics: { ...payload, loading: false } });
        });
    });

    describe('#getStakingMetrics', () => {
        it('reduces fullfilled', () => {
            const payload = { epoch: 10, secondsToNextEpoch: 10, index: 10, loading: true };
            const action = { type: getStakingMetrics.fulfilled, payload };
            const state = AppReducer(initialState, action);

            expect(state).toEqual({ ...initialState, staking: { ...payload, loading: false } });
        });
    });

    describe('IsActionRejected', () => {
        it('flags the error', () => {
            const action = { type: 'app/rejected', payload: {} };
            const state = AppReducer(initialState, action);

            expect(state).toEqual({ ...initialState, errorEncountered: true });
        });
    });
});
