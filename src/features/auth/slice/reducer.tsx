import { createSlice } from "@reduxjs/toolkit";
import { logIn, getSession, logOut } from "./auth-actions";

const initialState = {
  user: {
    user_id: "",
    manager_id: null,
    email: "",
    full_name: "",
    onboard_date: "",
    role: "",
  },
  loading: false,
  error: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = {
        user_id: "",
        manager_id: null,
        email: "",
        full_name: "",
        onboard_date: "",
        role: "",
      };
      state.loading = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(logIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.loading = false;
        console.log(action.payload.data);
      })
      .addCase(logIn.rejected, (state, action) => {
        state.error = action.payload!;
        state.loading = false;
      })
      .addCase(getSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSession.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.loading = false;
      })
      .addCase(getSession.rejected, (state, action) => {
        state.error = action.payload!;
        state.loading = false;
      })
      .addCase(logOut.pending, (state) => {
        state.loading = true;
      })
      .addCase(logOut.fulfilled, (state, action) => {
        state.user = action.payload.data;

        state.loading = false;
      })
      .addCase(logOut.rejected, (state, action) => {
        console.log(action.payload);
        state.error = action.payload!;
        state.loading = false;
      });
  },
});
export const { logout } = userSlice.actions;
export default userSlice.reducer;
