import ReactDOM from "react-dom";
import Root from "./Root";
import store from "./store/store";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import SnackMessage from "./components/Messages/snackbar";
import "./i18n";

import { theme } from "constants/theme";
import { NewWeb3ContextProvider } from "contexts/web3/web3.context";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

ReactDOM.render(
    <>
        <CssBaseline />
        <ThemeProvider theme={theme}>
            <NewWeb3ContextProvider>
                <Provider store={store}>
                    <SnackbarProvider
                        maxSnack={4}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        content={(key, message: string) => <SnackMessage id={key} message={JSON.parse(message)} />}
                        autoHideDuration={5000}
                    >
                        <Root />
                    </SnackbarProvider>
                </Provider>
            </NewWeb3ContextProvider>
        </ThemeProvider>
    </>,
    document.getElementById("root"),
);
