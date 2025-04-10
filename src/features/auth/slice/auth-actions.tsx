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

      const userData = await getUserInformation(data.session?.user.id!);
      if (!userData.success) return thunkAPI.rejectWithValue(userData.error);
      return {
        success: true,
        data: userData.data,
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
      const userData = await getUserInformation(data.session?.user.id!);
      if (!userData.success) return thunkAPI.rejectWithValue(userData.error);
      return {
        success: true,
        data: userData.data,
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
        user_id: "",
        manager_id: null,
        email: "",
        full_name: "",
        onboard_date: "",
        role: "",
      },
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

const getUserInformation = async (userId: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) return { success: false, error: error };
  return { success: true, data: data };
};
