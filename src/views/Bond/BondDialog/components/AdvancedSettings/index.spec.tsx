import { screen, render, fireEvent } from '@testing-library/react';

import AdvancedSettings from '.';

describe('AdvancedSettings', () => {
    const props = {
        slippage: 0.5,
        recipientAddress: '0x',
        handleChange: jest.fn(),
        handleClose: jest.fn(),
    };

    let container: Element;

    beforeEach(() => {
        container = render(<AdvancedSettings {...props} />).container;
    });

    it('initialise with values', () => {
        const inputs = container.getElementsByTagName('input');

        expect(inputs).toHaveLength(2);
        expect(inputs[0].value).toBe(props.slippage.toString());
        expect(inputs[1].value).toBe(props.recipientAddress);
    });

    it('triggers handleChange on value change', async () => {
        const inputs = await container.querySelectorAll('input');

        fireEvent.change(inputs[0]!, { target: { value: '20' } });
        expect(props.handleChange).toBeCalledWith({ slippage: 20, recipientAddress: '0x' });

        fireEvent.change(inputs[1]!, { target: { value: '0x2' } });
        expect(props.handleChange).toBeCalledWith({ slippage: 20, recipientAddress: '0x2' });
    });
});
