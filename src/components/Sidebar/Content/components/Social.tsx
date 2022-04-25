import { Box, SvgIcon, Link } from '@mui/material';

import { ReactComponent as Discord } from 'assets/icons/discord.svg';
import { ReactComponent as DocsIcon } from 'assets/icons/docs.svg';
import { ReactComponent as GitHub } from 'assets/icons/github.svg';
import { ReactComponent as Telegram } from 'assets/icons/telegram.svg';
import { ReactComponent as Twitter } from 'assets/icons/twitter.svg';

export default function Social() {
    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
            <Link href="https://github.com/Atbash-Protocol" target="_blank">
                <SvgIcon color="primary" component={GitHub} />
            </Link>

            <Link href="https://twitter.com/AtbashProtocol" target="_blank">
                <SvgIcon color="primary" component={Twitter} />
            </Link>

            <Link href="https://t.me/joinchat/rlVyL0qVGcI5NWZk" target="_blank">
                <SvgIcon viewBox="0 0 32 32" color="primary" component={Telegram} />
            </Link>

            <Link href="https://discord.gg/PWAj2pAUTR" target="_blank">
                <SvgIcon color="primary" component={Discord} />
            </Link>

            <Link href="https://docs.atbash.finance/" target="_blank">
                <SvgIcon color="primary" component={DocsIcon} />
            </Link>
        </Box>
    );
}
