import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name:'notification',
    initialState:null,
    reducers:{
        setNotificationState(state, action){
            return action.payload
        },

        clearNotificationState(state, action){
            return null
        }
    }
})

export const { setNotificationState, clearNotificationState } = notificationSlice.actions

export const setNotification = (message, type, timeInSeconds = 5) => {
    return async (dispatch) => {
        dispatch(setNotificationState({message, type}))

        setTimeout(() => {
            dispatch(clearNotificationState())
        }, timeInSeconds * 1000)
    }
}

export default notificationSlice.reducer