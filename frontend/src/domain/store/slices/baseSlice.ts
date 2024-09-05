import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IBaseInitialState {
  lang: string;
  token: string | null;
}

const initState: IBaseInitialState = {
  lang: "ru",
  token: null,
};

const core = createSlice({
  name: "flood",
  initialState: initState,
  reducers: {
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
  },
  extraReducers: () => {},
});

export default core.reducer;
export const { setToken } = core.actions;
