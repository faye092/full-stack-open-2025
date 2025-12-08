import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getAnecdotes, updateAnecdote } from '../requests'
import { useNotificationDispatch } from '../NotificationContext'

const AnecdoteList = () => {
    const queryClient = useQueryClient()
    const dispatch = useNotificationDispatch()

    const result = useQuery({
        queryKey: ['anecdotes'],
        queryFn: getAnecdotes,
        retry: 1
    })
    //update the mutation
    const updateAnecdoteMutation = useMutation({
        mutationFn: updateAnecdote,
        //when it is success
        onSuccess:(updatedAnecdote) => {
          queryClient.invalidateQueries({ queryKey: ['anecdotes']})

          //show the notification
          dispatch({ type:'SET', payload:`anecdote '${updatedAnecdote.content}' voted`})
          //clear out the notification after 5 second
          setTimeout(() => {
              dispatch({ type: 'CLEAR'})
          }, 5000)
        }
    })

    //deal with the vote submition
    const handleVote = (anecdote) => {
        updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1})
    }
    
    if(result.isLoading){
        return <div>loading data...</div>
    }
    if(result.error){
        return <div>anecdote service not available due to problems in server</div>
    }

    const anecdotes = result.data || []

    return(
        <div>
            {anecdotes.map(anecdote => 
                <div key={anecdote.id}>
                <div>{anecdote.content}</div>
                <div>
                    has {anecdote.votes}
                    <button onClick={() => handleVote(anecdote)}>vote</button>
                </div>
                </div>
            )}
        </div>
    )
}

export default AnecdoteList