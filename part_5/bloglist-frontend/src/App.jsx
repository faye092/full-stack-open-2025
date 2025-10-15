import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [changeMessage, setChangeMessage] = useState(null)
  const [refreshBlog, setRefreshBlog] = useState(false)
  const [newBlog, setNewBlog] = useState('')
  const [showAll, setShowAll] = useState(true)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>{
      blogs.sort((a,b) => b.likes -a.likes)
      setBlogs( blogs )
    })  
  }, [refreshBlog])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password})

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception){
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setChangeMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
        setRefreshBlog(!refreshBlog)
        setTimeout(() => {
          setChangeMessage(null)
        }, 5000)
      })
  }

  const addLikes = async(id, blogObject) => {
    await blogService.update(id, blogObject)
    setRefreshBlog(!refreshBlog)
  }

  const deleteBlog = async id => {
    await blogService.remove(id)
    setRefreshBlog(!refreshBlog)
  }

  if (user === null) {
    return(
      <div>
        <h2>Log in to application</h2>
        <Notification message={errorMessage}/>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input 
              type="text" 
              value={username}
              name='Username'
              onChange={({target}) => setUsername(target.value)}
              id='username'
            />
          </div>
        </form>
      </div>
    )
  }
  
  
}

export default App