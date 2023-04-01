import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  friendsName: null,
  combinedId: "0",
  groupsName: null,
  groupId: "0",
};

export const selectChatSlice = createSlice({
  name: "selectchat",
  initialState,
  reducers: {
    setfriendChatState: (state, action) => {
      state.friendsName = action.payload.friendsName;
      state.combinedId = action.payload.combinedId;
      state.groupsName = action.payload.groupsName;
    },
    setgroupChatState: (state, action) => {
      state.groupsName = action.payload.groupsName;
      state.groupId = action.payload.groupId;
      state.friendsName = action.payload.friendsName;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setfriendChatState, setgroupChatState } =
  selectChatSlice.actions;

export const SelectFriendName = (state) => state.selectchat.friendsName;
export const SelectCombinedId = (state) => state.selectchat.combinedId;
export const SelectGroupName = (state) => state.selectchat.groupsName;
export const SelectGroupId = (state) => state.selectchat.groupId;

export default selectChatSlice.reducer;
