import { render } from '@testing-library/react';

import * as UseAppReadyHook from 'hooks/useAppReady';

import { SideBar } from '.';

jest.mock('./Content/index.tsx', () => () => {
    const MockName = 'default-awesome-component-mock';
    return <> Mock </>;
});

describe('Sidebar', () => {
    it('renders without content', () => {
        jest.spyOn(UseAppReadyHook, 'useAppReady').mockReturnValue(false);

        const component = render(<SideBar isSidebarOpen isSmallScreen handleDrawerToggle={() => {}} />);

        expect(component).toMatchSnapshot();
    });

    it('renders with content', () => {
        jest.spyOn(UseAppReadyHook, 'useAppReady').mockReturnValue(true);

        const component = render(<SideBar isSidebarOpen isSmallScreen handleDrawerToggle={() => {}} />);

        expect(component.findAllByText(/Mock/)).toBeDefined();
    });
});
