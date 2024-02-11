import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./background.css";
import "@mdxeditor/editor/style.css";
import { getCurrentUserInfo } from "./api";
import { Provider } from "react-redux";
import store from "./redux/store";
import "./i18n";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider, createTheme } from "@mui/material";

getCurrentUserInfo();

// eslint-disable-next-line no-undef
const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#161B1D"
        },
        secondary: {
            main: "#FF5F00"
        }
    },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <GoogleOAuthProvider clientId={googleClientId}>
                <ThemeProvider theme={theme}>
                    <ThemeProvider theme={theme}>
                        <BrowserRouter>
                            <App />
                        </BrowserRouter>
                    </ThemeProvider>
                </ThemeProvider>
            </GoogleOAuthProvider>
        </Provider>
    </React.StrictMode>
);
