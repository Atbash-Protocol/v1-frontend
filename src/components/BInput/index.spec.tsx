import { render, screen, fireEvent } from '@testing-library/react';

import BInput from '.';

const renderComponent = (props: any) => {
    return render(<BInput {...props} />);
};

describe('BInput', () => {
    const props = {
        name: 'inputName',
        defaultValue: 0,
        maxValue: 10,
        placeholder: 'placeholder',
        endAdornmentLabel: 'SET MAX',
        onChange: jest.fn(),
    };

    it('sets the max on click on endAndornment label', async () => {
        const { container } = renderComponent(props);

        const setMaxBtn = await screen.findByText(props.endAdornmentLabel);
        fireEvent.click(setMaxBtn);

        const input = await container.querySelector('input');

        expect(input?.value).toEqual(props.maxValue.toString());
    });

    it('handles changes', async () => {
        const { container } = renderComponent(props);

        const input = await container.querySelector('input');
        fireEvent.change(input!, { target: { value: '20' } });

        expect(props.onChange).toHaveBeenCalledTimes(1);
        expect(props.onChange).toHaveBeenCalledWith({ [props.name]: '20' });
    });
});
