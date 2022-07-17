import { ReactNode, SyntheticEvent, useState } from 'react';

import { Box, Tabs, Tab } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Mint } from './components/Mint';
import { Redeem } from './components/Redeem';

enum PanelEnum {
    MINT = 0,
    REDEEM = 1,
}

interface TabPanelProps {
    children?: ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`stake-tabpanel-${index}`} aria-labelledby={`stake-tab-${index}`} {...other}>
            <Box sx={{ p: 3, color: 'red' }}>{children}</Box>
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `stake-tab-${index}`,
        'aria-controls': `stake-tabpanel-${index}`,
        sx: {
            color: 'white',
        },
    };
}

export const Actions = ({ bondID }: { bondID: string }) => {
    const [value, setValue] = useState(PanelEnum.MINT);
    const { t } = useTranslation();

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        event.preventDefault();
        setValue(newValue || 0);
    };

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs centered value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab value={0} label={<>{t('mint:Mint')}</>} {...a11yProps(0)} />
                <Tab value={1} label={<>{t('mint:Redeem')}</>} {...a11yProps(1)} />
            </Tabs>
            <TabPanel value={value} index={0}>
                <Mint bondID={bondID} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Redeem bondID={bondID} />
            </TabPanel>
        </Box>
    );
};
