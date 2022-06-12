/* eslint-disable import/no-extraneous-dependencies */
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: () => ({
        t: key => key,
    }),
}));
process.env = Object.assign(process.env, {
    REACT_APP_DEFAULT_NETWORK_ID: '1',
    REACT_APP_INFURA_ENDPOINT_URL: 'https://ropsten.infura.io/v3/',
    REACT_APP_NETWORK_RPC_URL: 'https://ropsten.infura.io/v3/',
});
