import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    // use useSelector to get all anecdotes
  // const anecdotes = useSelector(state => {
  //   return [...state.anecdotes].sort((a, b) => b.votes - a.votes)
  // })
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)
  // use useDispatch to get remote controller
  const dispatch = useDispatch()

  const filterAnecdotes = anecdotes.filter(anecdote =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  )

  const sortedAnecdotes = [...filterAnecdotes].sort((a, b) => b.votes - a.votes)

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote))

    dispatch(setNotification(`You voted '${anecdote.content}'`, 5))
  }
  
  return (
    <div>
      {sortedAnecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList