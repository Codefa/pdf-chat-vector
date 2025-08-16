import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPdfs = createAsyncThunk('pdf/fetchPdfs', async () => {
  const res = await fetch('http://localhost:5000/api/pdf/list');
  return await res.json();
});

const pdfSlice = createSlice({
  name: 'pdf',
  initialState: { pdfs: [], loading: false },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPdfs.pending, state => { state.loading = true; })
      .addCase(fetchPdfs.fulfilled, (state, action) => {
        state.pdfs = action.payload;
        state.loading = false;
      });
  }
});

export default pdfSlice.reducer;