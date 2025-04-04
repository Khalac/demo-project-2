import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/utils";

// create async thunk to handle when user log in
type DataLogIn = {
  email: string;
  password: string;
};

export const logIn = createAsyncThunk(
  "user/logIn",
  async (value: DataLogIn, thunkAPI) => {
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

export const getSession = createAsyncThunk(
  "user/getSession",
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

export const logOut = createAsyncThunk("user/logOut", async (_, thunkAPI) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) return thunkAPI.rejectWithValue(error.message);
    return {
      success: true,
      data: {
        email: "",
        userId: "",
      },
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});
