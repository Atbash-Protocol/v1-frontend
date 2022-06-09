import { render, fireEvent } from '@testing-library/react';

import DaysPicker from '.';

describe('DayPicker', () => {
    const props = {
        currentDay: 10,
        minDays: 5,
        maxDays: 100,
        onChange: jest.fn(),
    };

    it('returns the value of slide on change', async () => {
        const { container } = render(<DaysPicker {...props} />);

        const slider = await container.getElementsByTagName('input');

        expect(slider).toHaveLength(1);
        expect(slider[0].min).toEqual(props.minDays.toString());
        expect(slider[0].max).toEqual(props.maxDays.toString());
        expect(slider[0].value).toEqual(props.currentDay.toString());

        fireEvent.change(slider[0], { target: { value: '20' } });
        expect(props.onChange).toHaveBeenCalledWith(20);
    });
});
