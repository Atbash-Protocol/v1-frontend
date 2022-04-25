import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';

import { NotFound } from 'views';

describe('NotFound', () => {
    let container: HTMLDivElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    it('renders', () => {
        act(() => {
            ReactDOM.render(<NotFound />, container);
        });

        expect(container).toMatchSnapshot();
        expect(container.querySelector('p')?.textContent).toBe('Page not found');
    });
});
