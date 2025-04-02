import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/utils";

// create async thunk to handle when user log in
type dataLogInType = {
  email: string;
  password: string;
};

export const logIn = createAsyncThunk(
  "user/logIn",
  async (value: dataLogInType, thunkAPI) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: value.email,
        password: value.password,
      });
      if (error) return thunkAPI.rejectWithValue(error.message);

      return { email: data.user?.email, userId: data.user?.id };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
const initialState = {
  user: {
    userId: "",
    email: "",
  },
  loading: "idle",
  error: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = { userId: "", email: "" };
      state.loading = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(logIn.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.user.userId = action.payload.userId || "";
        state.user.email = action.payload.email || "";
      })
      .addCase(logIn.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload!;
      });
  },
});
export const { logout } = userSlice.actions;
export default userSlice.reducer;
