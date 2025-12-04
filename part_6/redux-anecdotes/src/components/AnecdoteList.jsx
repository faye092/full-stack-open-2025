import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'

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

  const vote = (id, content) => {
    console.log('vote', id)
    dispatch(voteAnecdote(id))

    dispatch(setNotification(`you voted '${content}'`))

    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
  }
  
  return (
    <div>
      {sortedAnecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id, anecdote.content)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList