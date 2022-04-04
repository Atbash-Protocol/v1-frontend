import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom";

import { ReactElement, useMemo, forwardRef } from "react";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { theme } from "constants/theme";

interface ListItemLinkProps {
    icon?: ReactElement;
    primary: string;
    to: string;
    disabled?: boolean;
    renderComponent?: any;
}

export const ListItemLink = ({ icon, primary, to, disabled = false, renderComponent }: ListItemLinkProps) => {
    const renderLink = useMemo(
        () =>
            forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, "to">>(function Link(itemProps, ref) {
                return <RouterLink to={to} ref={ref} {...itemProps} role={undefined} onClick={() => null} />;
            }),
        [to],
    );

    return (
        <li key={`route-${to}`}>
            <ListItemButton disabled={disabled} component={renderComponent ?? renderLink}>
                {icon ? <ListItemIcon sx={{ color: theme.palette.secondary.main }}>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary} />
            </ListItemButton>
        </li>
    );
};
