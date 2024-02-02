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

getCurrentUserInfo();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);
