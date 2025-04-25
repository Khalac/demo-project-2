import { createSlice } from "@reduxjs/toolkit";
import type { ListleaveRequest } from "./list-leave-request-data-type";

const initialState: {
  listLeaveRequest: ListleaveRequest[];
} = { listLeaveRequest: [] };

const listLeaveRequestSlice = createSlice({
  name: "listLeaveRequest",
  initialState,
  reducers: {
    saveListLeaveRequest: (state, action) => {
      state.listLeaveRequest = action.payload;
    },
  },
});

export const { saveListLeaveRequest } = listLeaveRequestSlice.actions;
export default listLeaveRequestSlice.reducer;
