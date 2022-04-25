import { BrowserRouter } from 'react-router-dom';

import Loader from 'components/Loader';
import ViewBase from 'layout/ViewBase';
import { useWeb3ContextInitialized } from 'lib/web3/web3.hooks';

import App from './App';

function Root(): JSX.Element {
    const web3ContextReady = useWeb3ContextInitialized();

    if (!web3ContextReady) return <Loader />;

    return <App />;
}

// DOC : Using BrowserRouter before viewbase because of the <Link> components in Menu
export const RenderWithViewBase = () => (
    <BrowserRouter>
        <ViewBase>
            <Root />
        </ViewBase>
    </BrowserRouter>
);
export default RenderWithViewBase;
