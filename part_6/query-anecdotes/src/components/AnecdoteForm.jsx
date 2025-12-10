import { useMutation, useQueryClient } from 'react-query'
import { createAnecdote } from '../requests'
import { useNotificationDispatch } from '../NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  //create the mutation
  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    //when it is success
    onSuccess:(newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes']})

      //show the notification
      dispatch({ type:'SET', payload:`anecdote '${newAnecdote.content}' created`})

      //clear out the notification after 5 second
      setTimeout(() => {
        dispatch({ type: 'CLEAR'})
      }, 5000)
    },

    //when it is failed
    onError:(error) => {
      const errorMessage = error.response?.data?.error || 'Too short anecdote, must have length 5 or more'
      dispatch({ type: 'SET', payload: errorMessage})

      setTimeout(() => {
        dispatch({ type: 'CLEAR'})
      }, 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({content, vote: 0})
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
