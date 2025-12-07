import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from "../services/anecdotes"

//1. initialState becomes the empty arrays
const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers:{
    //1. set all anecdotes
    setAnecdotes(state, action){
      return action.payload
    },
    //2. record vote changes
    updateAnecdote(state, action){
      const changedAnecdote = action.payload
      return state.map(n => n.id !== changedAnecdote.id ? n : changedAnecdote
      )
    },
    //3. record the new Anecdotes
    appendAnecdote(state, action){
      state.push(action.payload)
    }
  }
})

export const { setAnecdotes, updateAnecdote, appendAnecdote} = anecdoteSlice.actions

//initialize Thunk
export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}
//create Anecdote Thunk
export const createAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

//vote Anecdote Thunk
export const voteAnecdote = (anecdote) => {
  return async dispatch => {
    const changedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1
    }
    const updatedAnecdote = await anecdoteService.update(anecdote.id, changedAnecdote)
    dispatch(updateAnecdote(updatedAnecdote))
  }
}

export default anecdoteSlice.reducer
