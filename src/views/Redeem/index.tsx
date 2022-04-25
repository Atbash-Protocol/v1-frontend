import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { BCard } from 'components/BCard';

function Redeem() {
    const { t } = useTranslation();

    return (
        <BCard title={t('bond:Redeem')} zoom={true}>
            <Typography> {t('ComingSoon')} </Typography>
        </BCard>
    );
}

export default Redeem;
