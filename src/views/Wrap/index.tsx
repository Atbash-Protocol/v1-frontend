import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { BCard } from 'components/BCard';

function Wrap() {
    const { t } = useTranslation();

    return (
        <BCard title={t('bond:Wrap')} zoom={true}>
            <Typography>
                <>{t('ComingSoon')} </>
            </Typography>
        </BCard>
    );
}

export default Wrap;
