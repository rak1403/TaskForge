import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export const fetchMembers = createAsyncThunk(
  "members/fetchMembers",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/projects/${projectId}/members`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch members");
    }
  }
);

export const addMember = createAsyncThunk(
  "members/addMember",
  async ({ projectId, email, role }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/projects/${projectId}/members`, { email, role });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add member");
    }
  }
);

const memberSlice = createSlice({
  name: "members",
  initialState: {
    members: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addMember.fulfilled, (state) => {
        // We'll refetch members after adding one
      });
  },
});

export default memberSlice.reducer;
