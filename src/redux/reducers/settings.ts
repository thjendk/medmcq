import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  language: 'dk', // Hvilket sprog er valgt? kan være 'dk' eller 'gb'
  version: '0.0.1', // App version
  firstTime: true, // Is it the users first time? Then display description modal.
  notice: null,
};

const settingsReducer = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    changeSettings: (
      state,
      action: PayloadAction<{ type: keyof typeof initialState; value: string | boolean }>
    ) => {
      const { type, value } = action.payload;
      state[type as any] = value; // Typing doesnt work here for some reason
    },
    setFirstTime: (state, action: PayloadAction<boolean>) => {
      state.firstTime = action.payload;
    },
    setNotice: (state, action: PayloadAction<string>) => {
      state.notice = action.payload;
    },
  },
});

export default settingsReducer;
