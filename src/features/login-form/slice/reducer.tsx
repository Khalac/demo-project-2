import { createSlice } from "@reduxjs/toolkit";
import { logIn, getSession } from "./actions";

const initialState = {
  user: {
    userId: "",
    email: "",
  },
  loading: false,
  error: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = { userId: "", email: "" };
      state.loading = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(logIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.user.userId = action.payload.data.userId || "";
        state.user.email = action.payload.data.email || "";
        state.loading = false;
      })
      .addCase(logIn.rejected, (state, action) => {
        state.error = action.payload!;
        state.loading = false;
      })
      .addCase(getSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSession.fulfilled, (state, action) => {
        state.user.userId = action.payload.data.userId || "";
        state.user.email = action.payload.data.email || "";
        state.loading = false;
      })
      .addCase(getSession.rejected, (state, action) => {
        state.error = action.payload!;
        state.loading = false;
      });
  },
});
export const { logout } = userSlice.actions;
export default userSlice.reducer;
