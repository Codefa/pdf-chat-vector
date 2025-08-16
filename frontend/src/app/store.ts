import { configureStore } from '@reduxjs/toolkit';
import pdfReducer from '../features/pdfSlice';
import chatReducer from '../features/chatSlice';

export const store = configureStore({
  reducer: {
    pdf: pdfReducer,
    chat: chatReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;