import ReactDOM from "react-dom";
import Root from "./Root";
import store from "./store/store";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import SnackMessage from "./components/Messages/snackbar";
import "./i18n";

import { ThemeProvider } from "@material-ui/core";
import { theme } from "constants/theme";
import { NewWeb3ContextProvider } from "contexts/web3/web3.context";
import { CssBaseline } from "@mui/material";

ReactDOM.render(
    <>
        <CssBaseline />
        <ThemeProvider theme={theme}>
            <SnackbarProvider
                maxSnack={4}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                content={(key, message: string) => <SnackMessage id={key} message={JSON.parse(message)} />}
                autoHideDuration={5000}
            >
                <NewWeb3ContextProvider>
                    <Provider store={store}>
                        <Root />
                    </Provider>
                </NewWeb3ContextProvider>
            </SnackbarProvider>
        </ThemeProvider>
    </>,
    document.getElementById("root"),
);
