import React, { useState } from 'react';

import { Box, useMediaQuery } from '@mui/material';

import Header from 'components/Header';
import Messages from 'components/Messages';
import { SideBar } from 'components/Sidebar';
import { theme } from 'constants/theme';

import BackgroundImage from '../../assets/background.webp';

interface IViewBaseProps {
    children: React.ReactNode;
}

// const useStyles = makeStyles(theme => ({
//     drawer: {
//         [theme.breakpoints.up("md")]: {
//             width: DRAWER_WIDTH,
//             flexShrink: 0,
//         },
//     },
//     content: {
//         padding: theme.spacing(1),
//         transition: theme.transitions.create("margin", {
//             easing: theme.transitions.easing.sharp,
//             duration: TRANSITION_DURATION,
//         }),
//         height: "100%",
//         overflow: "auto",
//         marginLeft: DRAWER_WIDTH,
//     },
//     contentShift: {
//         transition: theme.transitions.create("margin", {
//             easing: theme.transitions.easing.easeOut,
//             duration: TRANSITION_DURATION,
//         }),
//         marginLeft: 0,
//     },
// }));

function ViewBase({ children }: IViewBaseProps) {
    const [isSidebarOpen, setisSidebarOpen] = useState(false);

    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleDrawerToggle = () => {
        setisSidebarOpen(!isSidebarOpen);
    };

    return (
        <Box
            sx={{
                height: '100vh',
                backgroundImage: `url(${BackgroundImage})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPositionX: 'center',
                backgroundPositionY: 'center',
            }}
        >
            <Messages />
            <Header {...{ handleDrawerToggle, isSmallScreen }} />
            <Box>
                <SideBar isSidebarOpen={isSidebarOpen} isSmallScreen={isSmallScreen} handleDrawerToggle={handleDrawerToggle} />
            </Box>
            <Box
                className="content"
                sx={{
                    paddingLeft: {
                        xs: 0,
                        height: '100%',
                        sm: theme.spacing(40), //TODO: Use a dynamic drawer
                    },
                    maxHeight: '100vh',
                    overflowY: 'scroll',
                    paddingBottom: theme.spacing(8),
                }}
            >
                {children}
            </Box>
        </Box>
    );
}

export default ViewBase;
