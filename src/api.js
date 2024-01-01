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
        }).catch(defaultErrorHandler);
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

export const signUp = (data, onSuccess, onError, onFinally) => {
    api.post("account/sign-up", {
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
        }).catch(defaultErrorHandler);
};

export const getReviewsPage = (page, sortTarget, sortType, onSuccess) => {
    api.get(`reviews/get-page/${page}/${sortTarget}/${sortType}`)
        .then(response => {
            if (response.status === 200) {
                onSuccess(response.data);
            }
        }).catch(defaultErrorHandler);
};

export const getReviewPagesCount = (onSuccess) => {
    api.get("reviews/get-pages-count")
        .then(response => {
            if (response.status === 200) {
                onSuccess(response.data);
            }
        }).catch(defaultErrorHandler);
};

export const getLeisureInfo = (leisureId, onSuccess) => {
    api.get(`leisures/get-info/${leisureId}`)
        .then(response => {
            if (response.status === 200) {
                console.log(response.data)
                onSuccess(response.data);
            }
        }).catch(defaultErrorHandler);
};


const defaultErrorHandler = () => {
    console.error("Server connection error");
};

const setAccountInfo = (responseData) => {
    if (responseData.isAuthorized) {
        store.dispatch(login());
    }
    sessionStorage.setItem("currentUser", JSON.stringify(responseData.currentUser));
};