import { Provider } from 'react-redux';

import { Web3Context } from 'contexts/web3/web3.context';

export const renderComponent = ({ component, store, context }: { component: JSX.Element; store: any; context: any }) => {
    return (
        <Web3Context.Provider value={context}>
            <Provider store={store}>{component}</Provider>
        </Web3Context.Provider>
    );
};
