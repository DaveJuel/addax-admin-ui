import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reload: false,
  user: null,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    toggleReload: (state) => {
      state.reload = !state.reload;
    }
  },
});

export const { toggleReload, setUser } = globalSlice.actions;
export default globalSlice.reducer;
