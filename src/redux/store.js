import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import reviewEditorSlice from "./slices/reviewEditorSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    reviewEditor: reviewEditorSlice
});

const store = configureStore({
    reducer: rootReducer
});

export default store;