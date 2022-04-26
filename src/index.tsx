import './i18n';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { theme } from 'constants/theme';
import { Web3ContextProvider } from 'contexts/web3/web3.context';

import Root from './Root';
import store from './store/store';

ReactDOM.render(
    <>
        <CssBaseline />
        <ThemeProvider theme={theme}>
            <Web3ContextProvider>
                <Provider store={store}>
                    <SnackbarProvider
                        maxSnack={4}
                        // anchorOrigin={{
                        //     vertical: 'bottom',
                        //     horizontal: 'right',
                        // }}
                        // content={(key, message: string) => <SnackMessage id={key} message={JSON.parse(message)} />}
                        // autoHideDuration={5000}
                    >
                        <Root />
                    </SnackbarProvider>
                </Provider>
            </Web3ContextProvider>
        </ThemeProvider>
    </>,
    document.getElementById('root'),
);
