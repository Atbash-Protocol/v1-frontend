import { render } from '@testing-library/react';

import * as useWeb3ContextInitialized from 'contexts/web3/web3.hooks';

import { SideBar } from '.';

jest.mock('./Content/index.tsx', () => () => {
    const MockName = 'default-awesome-component-mock';
    return <> Mock </>;
});

describe('Sidebar', () => {
    it('renders without content', () => {
        jest.spyOn(useWeb3ContextInitialized, 'useWeb3ContextInitialized').mockReturnValue(false);

        const component = render(<SideBar isSidebarOpen isSmallScreen handleDrawerToggle={() => {}} />);

        expect(component).toMatchSnapshot();
    });

    it('renders with content', () => {
        jest.spyOn(useWeb3ContextInitialized, 'useWeb3ContextInitialized').mockReturnValue(true);

        const component = render(<SideBar isSidebarOpen isSmallScreen handleDrawerToggle={() => {}} />);

        expect(component.findAllByText(/Mock/)).toBeDefined();
    });
});
