import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from './reducers/notificationReducer'
import blogReducer from './reducers/blogReducer'
import { useReducer } from "react";

const store = configureStore({
    reducer:{
        notification:notificationReducer,
        blogs:blogReducer,
        user:useReducer,
    }
})

export default store