import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userUid: null,
  userEmail: null,
  userDisplayName: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setActiveUser: (state, action) => {
      state.userUid = action.payload.userUid;
      state.userEmail = action.payload.userEmail;
      state.userDisplayName = action.payload.userDisplayName;
    },
    setUserLogoutState: (state) => {
      state.userUid = null;
      state.userEmail = null;
      state.userDisplayName = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setActiveUser, setUserLogoutState } = userSlice.actions;

export const SelectUid = (state) => state.user.userUid;
export const SelectEmail = (state) => state.user.userEmail;
export const SelectDisplayName = (state) => state.user.userDisplayName;

export default userSlice.reducer;
