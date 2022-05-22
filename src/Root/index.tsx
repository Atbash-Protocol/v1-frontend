import { lazy, Suspense } from 'react';

import { BrowserRouter } from 'react-router-dom';

import Loader from 'components/Loader';
import { useWeb3ContextInitialized } from 'contexts/web3/web3.hooks';
import ViewBase from 'layout/ViewBase';

const App = lazy(() => import('./App'));

function Root(): JSX.Element {
    const web3ContextReady = useWeb3ContextInitialized();

    if (!web3ContextReady) return <Loader />;

    return (
        <Suspense fallback={<Loader />}>
            <App />
        </Suspense>
    );
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
