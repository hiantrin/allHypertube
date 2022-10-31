import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userSlice"
import logReducer from "./reducers/userLog"

export const store = configureStore({
    reducer : {
        userData : userReducer,
        userLog: logReducer
    }
});

