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

      if (error) {
        return thunkAPI.rejectWithValue(error.message);
      }

      return {
        success: true,
        data: { email: data.user?.email, userId: data.user?.id },
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getUserSession = createAsyncThunk(
  "user/getUserSession",
  async (_, thunkAPI) => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) return thunkAPI.rejectWithValue(error.message);
      return {
        success: true,
        data: {
          email: data.session?.user.email,
          userId: data.session?.user.id,
        },
      };
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
      .addCase(getUserSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserSession.fulfilled, (state, action) => {
        state.user.userId = action.payload.data.userId || "";
        state.user.email = action.payload.data.email || "";
        state.loading = false;
      })
      .addCase(getUserSession.rejected, (state, action) => {
        state.error = action.payload!;
        state.loading = false;
      });
  },
});
export const { logout } = userSlice.actions;
export default userSlice.reducer;
