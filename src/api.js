import axios from "axios";
import { login, logout } from "./redux/slices/authSlice";
import store from "./redux/store";

// eslint-disable-next-line no-undef
const apiUrl = process.env.NODE_ENV === "development" ? "/api" : `${process.env.REACT_APP_API_HOST}/api`;

const api = axios.create({
    baseURL: apiUrl
});


export const checkAuth = () => {
    api.get("account/check-auth")
        .then(response => {
            setAccountInfo(response.data);
        });
};

export const signIn = (data, onSuccess, onError, onFinally) => {
    api.post("account/sign-in", {
        username: data.username,
        password: data.password,
        rememberMe: data.rememberMe
    }).then(response => {
        if (response.status === 200) {
            setAccountInfo(response.data);
            onSuccess();
        }
    }).catch(onError).finally(onFinally);
};

export const signOut = () => {
    api.post("account/sign-out")
        .then(response => {
            if (response.status === 200) {
                store.dispatch(logout());
                sessionStorage.removeItem("currentUser");
            }
        });
};


const setAccountInfo = (responseData) => {
    if (responseData.isAuthorized) {
        store.dispatch(login());
    }
    sessionStorage.setItem("currentUser", JSON.stringify(responseData.currentUser));
};