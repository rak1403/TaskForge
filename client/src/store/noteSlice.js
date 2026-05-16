import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export const fetchNotes = createAsyncThunk(
  "notes/fetchNotes",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/notes/${projectId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch notes");
    }
  }
);

export const createNote = createAsyncThunk(
  "notes/createNote",
  async ({ projectId, noteData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/notes/${projectId}`, noteData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create note");
    }
  }
);

const noteSlice = createSlice({
  name: "notes",
  initialState: {
    notes: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.notes.unshift(action.payload);
      });
  },
});

export default noteSlice.reducer;
