import ReactDOM from 'react-dom';
import Root from './Root';
import store from './store/store';
import { Provider } from 'react-redux';
import { Web3ContextProvider } from './hooks';
import { SnackbarProvider } from 'notistack';
import SnackMessage from './components/Messages/snackbar';
import './i18n';

import { ThemeProvider } from '@material-ui/core';
import { theme } from 'constants/theme';

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <SnackbarProvider
            maxSnack={4}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            content={(key, message: string) => <SnackMessage id={key} message={JSON.parse(message)} />}
            autoHideDuration={10000}
        >
            <Provider store={store}>
                <Web3ContextProvider>
                    <Root />
                </Web3ContextProvider>
            </Provider>
        </SnackbarProvider>
    </ThemeProvider>,
    document.getElementById('root'),
);
