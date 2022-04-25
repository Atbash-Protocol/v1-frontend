import './styles.scss';
import React, { useState } from 'react';

import { CssBaseline } from '@material-ui/core';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Button, Drawer, Toolbar, Typography, useTheme } from '@mui/material';

interface IViewBaseProps {
    children: React.ReactNode;
}
const drawerWidthOpen = 240;
const paddingIconButton = 10;
const marginIconButton = 14;
const iconFontSize = 20;
const drawerWidthClose = (paddingIconButton + marginIconButton) * 2 + iconFontSize;
const drawerWidth = 240;

const styles = (theme: any) => ({
    shiftTextLeft: {
        marginLeft: '0px',
    },
    shiftTextRight: {
        marginLeft: drawerWidth,
    },
});

export const BaseLayout = ({ children }: IViewBaseProps): JSX.Element => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();

    return (
        <>
            <CssBaseline />

            <Box className="base-layout-root">
                <Drawer
                    anchor="left"
                    variant="permanent"
                    open={open}
                    sx={{
                        width: open ? { xs: '1rem', sm: drawerWidthClose } : { xs: drawerWidthClose, sm: drawerWidthOpen },
                        transition: theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: open ? theme.transitions.duration.leavingScreen : theme.transitions.duration.enteringScreen,
                        }),
                        '& .MuiDrawer-paper': {
                            overflowX: 'hidden',
                            width: open ? { xs: '0px', sm: drawerWidthClose } : { xs: drawerWidthClose, sm: drawerWidthOpen },
                            borderRight: '0px',
                            borderRadius: '0px 0px 0px 0px',
                            boxShadow: theme.shadows[8],
                            backgroundColor: open ? '#11101D' : '#11101D',
                            transition: theme.transitions.create('width', {
                                easing: theme.transitions.easing.sharp,
                                duration: open ? theme.transitions.duration.leavingScreen : theme.transitions.duration.enteringScreen,
                            }),
                        },
                    }}
                >
                    <Button
                        onClick={() => setOpen(!open)}
                        sx={{
                            minWidth: 'initial',
                            padding: '10px',
                            color: 'gray',
                            borderRadius: '0px',
                            backgroundColor: open ? 'transparent' : 'red',
                            '&:hover': {
                                backgroundColor: '#26284687',
                            },
                        }}
                    >
                        <MenuIcon sx={{ fontSize: '20px', color: open ? 'lightgray' : 'lightGray' }}></MenuIcon>
                    </Button>
                </Drawer>

                <Box
                    component="header"
                    sx={{
                        marginBottom: '5rem',
                    }}
                >
                    <AppBar sx={{ backgroundColor: 'transparent' }}>
                        <Toolbar>
                            <Typography sx={{ paddingLeft: '5rem' }}> Menu</Typography>
                        </Toolbar>
                    </AppBar>
                </Box>
            </Box>
        </>
    );
};
