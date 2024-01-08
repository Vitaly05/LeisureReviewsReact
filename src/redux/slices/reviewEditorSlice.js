import { createSlice } from "@reduxjs/toolkit";

const reviewEditorSlice = createSlice({
  name: "reviewEditor",
  initialState: { authorId: "" },
  reducers: {
    setAuthorId: (state, action) => {
      state.authorId = action.payload;
    }
  }
});

export const { setAuthorId } = reviewEditorSlice.actions;

export default reviewEditorSlice.reducer;