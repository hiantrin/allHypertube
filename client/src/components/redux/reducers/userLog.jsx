import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userLog : false
}

const userSlice = createSlice ({
    name : "userLog",
    initialState,
    reducers :{
        addUserLog : (state, {payload}) => {
            state.userLog = payload;
        }
    }
})

export const { addUserLog } = userSlice.actions;
export const getUserLog = (state) => state.userLog.userLog;
export default userSlice.reducer;