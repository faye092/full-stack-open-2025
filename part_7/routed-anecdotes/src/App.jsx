import { useState } from 'react'
import {
  Routes, Route, Link, useMatch, useParams, useNavigate
} from "react-router-dom"
import { useField, useCountry } from './hooks'

const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Link style={padding} to="/">anecdotes</Link>
      <Link style={padding} to="/create">create new</Link>
      <Link style={padding} to="/about">about</Link>
      {/* {user
        ?<em>{user} logged</em>
        : <Link style={padding} to="/login">login</Link>
      } */}
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => {
  const id = useParams.id
  const anecdote = anecdotes.find( n => n.id === Number(id) )
  return(
    <div>
      <h2>Anecdotes</h2>
      <ul>
        {anecdotes.map(anecdote => 
        <li key={anecdote.id} >
          <Link to={`/anecdotes/${anecdote.id}`}>
            {anecdote.content}
          </Link>
        </li>)}
      </ul>
    </div>
  )
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const Anecdote = ({anecdote}) => {
  return (
    <div>
      <h2>{anecdote.content} by {anecdote.author}</h2>
      <div> has {anecdote.votes} votes</div>
      <div>for more info see <a href={anecdote.info}>{anecdote.info}</a></div>
    </div>
  )
}


const CreateNew = (props) => {
  const {reset: resetContent, ...content} = useField('text')
  const {reset: resetAuthor, ...author} = useField('text')
  const {reset: resetInfo, ...info} = useField('text')
  
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content:content.value,
      author:author.value,
      info:info.value,
      votes: 0
    })
    navigate('/')
  }

  const handleReset = (e) => {
    e.preventDefault()
    resetContent()
    resetAuthor()
    resetInfo()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content} />
        </div>
        <div>
          author
          <input {...author} />
        </div>
        <div>
          url for more info
          <input {...info} />
        </div>
        <button>create</button>
        <button onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}

const Country = ({country}) => {
    if (!country) {
      return null
    }
    if (!country.found) {
      return (
        <div>
          not found...
        </div>
    )
    }
    return (
      <div>
        <h3>{country.data.name.common} </h3>
        <div>capital {country.data.capital} </div>
        <div>population {country.data.population}</div> 
        <img src={country.data.flags.png} height='100' alt={`flag of ${country.data.name.common}`}/> 
      </div>
    )
  }


const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])
  

  const [notification, setNotification] = useState('')
 

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))

    setNotification(`a new anecdote '${anecdote.content}' created!`)

    setTimeout(() => {
      setNotification('')
    }, 5000)
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }
  const match = useMatch('/anecdotes/:id')

  const anecdote = match 
    ? anecdotes.find(anecdote => anecdote.id === Number(match.params.id))
    : null

  const nameInput = useField('text')
  const [name, setName] = useState('')

  const country = useCountry(name)
  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>
      <Country country={country}/>

      {notification && 
        <div style={{border:'1px solid red', padding:10, marginBottom:10}}>
          {notification}
        </div>      
      }
      <Routes>
        <Route path="/anecdotes/:id" element={<Anecdote anecdote={anecdote} />} />
        <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
        <Route path="/about" element={<About />} />
        <Route path="/create" element={<CreateNew addNew={addNew} />} />
      </Routes>

      <Footer />
    </div>
  )
}

export default App
