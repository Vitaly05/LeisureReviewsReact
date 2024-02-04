import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import googleAuthReducer from "./slices/googleAuthSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    googleAuth: googleAuthReducer
});

const store = configureStore({
    reducer: rootReducer
});

export default store;