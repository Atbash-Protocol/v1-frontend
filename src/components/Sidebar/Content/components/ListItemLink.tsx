import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom";

import { ListItemIcon, ListItemText } from "@material-ui/core";
import { ReactElement, useMemo, forwardRef } from "react";
import { ListItemButton } from "@mui/material";

interface ListItemLinkProps {
    icon?: ReactElement;
    primary: string;
    to: string;
    disabled: boolean;
}

export const ListItemLink = ({ icon, primary, to, disabled }: ListItemLinkProps) => {
    const renderLink = useMemo(
        () =>
            forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, "to">>(function Link(itemProps, ref) {
                return <RouterLink to={to} ref={ref} {...itemProps} role={undefined} onClick={() => null} />;
            }),
        [to],
    );

    return (
        <li>
            <ListItemButton disabled={disabled} component={renderLink}>
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary} />
            </ListItemButton>
        </li>
    );
};
