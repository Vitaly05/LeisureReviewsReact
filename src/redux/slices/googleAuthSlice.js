import { createSlice } from "@reduxjs/toolkit";

const googleAuthSlice = createSlice({
    name: "googleAuth",
    initialState: { credential: "" },
    reducers: {
        setCredential: (state, action) => {
            state.credential = action.payload;
            console.log(state.credential)
        },
        clearCredential: (state) => {
            state.credential = "";
            console.log(state.credential)
        },
    }
});

export const { setCredential, clearCredential } = googleAuthSlice.actions;

export default googleAuthSlice.reducer;