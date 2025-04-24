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
    avatar_url: "",
  },
  loading: false,
  error: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(logIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.user = action.payload.data;
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
        state.error = action.payload!;
        state.loading = false;
      });
  },
});

export default userSlice.reducer;
