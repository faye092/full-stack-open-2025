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
    const updateAnecdoteMutation = useMutation(updateAnecdote, {
        onSuccess:() => {
        queryClient.invalidateQueries({ queryKey: ['anecdotes']})
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