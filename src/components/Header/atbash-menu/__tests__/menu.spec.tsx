import { render, fireEvent, screen } from '@testing-library/react';

import { DEFAULT_NETWORK } from 'constants/blockchain';
import { Web3Context } from 'contexts/web3/web3.context';

import AtbashMenu from '..';

function renderComponent(component: JSX.Element, contextState?: any) {
    return render(<Web3Context.Provider value={contextState}>{component}</Web3Context.Provider>);
}

describe('AtbashMenu', () => {
    it('renders', async () => {
        const { container } = renderComponent(<AtbashMenu />, {
            state: { signer: 'signer', signerAddress: 'signerAddress', networkID: DEFAULT_NETWORK },
        });

        expect(container).toMatchSnapshot();
        expect(container.querySelector('button')?.textContent).toBe('BuyBASH');

        const btn = container.querySelector('button');
        console.log(screen.getByText(/BuyBASH/i).parentElement?.parentElement?.innerHTML);
        fireEvent.click(screen.getByText(/BuyBASH/i));

        expect(container).toMatchSnapshot();
    });
});
