import { ReactNode, SyntheticEvent, useState } from 'react';

import { Box, Tab, Tabs } from '@mui/material';

import { theme } from 'constants/theme';

interface TabItem {
    label: string;
    component: JSX.Element;
}

interface MultiTabProps {
    tabs: TabItem[];
}

interface TabPanelProps {
    children?: ReactNode;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`bmultitab-tabpanel-${index}`} aria-labelledby={`bmultitab-tab-${index}`} {...other}>
            <Box
                sx={{
                    [theme.breakpoints.up('md')]: { padding: 3 },
                    [theme.breakpoints.down('md')]: { padding: 0 },
                }}
            >
                {children}
            </Box>
        </div>
    );
};

const a11yProps = (index: number) => {
    return {
        id: `bmultitab-tab-${index}`,
        'aria-controls': `bmultitab-tabpanel-${index}`,
        sx: {
            color: 'white',
        },
    };
};

export const BMultiTabs = ({ tabs }: MultiTabProps) => {
    const [value, setValue] = useState(0);

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        event.preventDefault();
        setValue(newValue || 0);
    };

    const tabLabels = tabs.flatMap(({ label }) => label);

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs centered value={value} onChange={handleChange} aria-label="basic tabs example">
                {tabLabels.map((label, index) => (
                    <Tab key={index} value={index} label={<>{label}</>} {...a11yProps(0)} />
                ))}
            </Tabs>

            {tabs.map(({ component }, index) => (
                <TabPanel key={index} value={value} index={index}>
                    {component}
                </TabPanel>
            ))}
        </Box>
    );
};
