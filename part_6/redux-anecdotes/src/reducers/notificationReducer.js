import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers:{
        setNotificationContent(state, action){
            return action.payload
        },
        clearNotificationContent(state, action){
            return null
        }
    }
})

export const { setNotificationContent, clearNotificationContent } = notificationSlice.actions

export const setNotification = (message, duration) => {
    return async dispatch => {
        dispatch(setNotificationContent(message))

        setTimeout(() => {
            dispatch(clearNotificationContent())
        }, duration * 1000)
    }
}
export default notificationSlice.reducer