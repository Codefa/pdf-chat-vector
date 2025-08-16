import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: { chatId: null, messages: [] },
  reducers: {
    setChatId(state, action) {
      state.chatId = action.payload;
    },
    setMessages(state, action) {
      state.messages = action.payload;
    },
    addMessage(state, action) {
      state.messages.push(action.payload);
    }
  }
});

export const { setChatId, setMessages, addMessage } = chatSlice.actions;
export default chatSlice.reducer;