import { ReactElement, useMemo, forwardRef } from 'react';

import { ListItemButton, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

import { theme } from 'constants/theme';

interface ListItemLinkProps {
    icon?: ReactElement;
    primary: string;
    to: string;
    disabled?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderComponent?: any;
    extra?: JSX.Element;
}

export const ListItemLink = ({ icon, primary, extra, to, disabled = false, renderComponent }: ListItemLinkProps) => {
    const renderLink = useMemo(
        () =>
            forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'to'>>(function Link(itemProps, ref) {
                return <RouterLink to={to} ref={ref} {...itemProps} role={undefined} onClick={() => null} />;
            }),
        [to],
    );

    return (
        <li key={`route-${to}`}>
            <ListItemButton disabled={disabled} component={renderComponent ?? renderLink}>
                {icon ? <ListItemIcon sx={{ color: theme.palette.primary.main }}>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary} />
                <> {extra}</>
            </ListItemButton>
        </li>
    );
};
