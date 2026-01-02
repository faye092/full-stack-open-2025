import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

import blogService from './services/blogs'
import loginService from './services/login'

import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs, createBlog, likeBlog, removeBlog } from './reducers/blogReducer'
import { setUser, clearUser } from './reducers/userReducer'
import blogs from './services/blogs'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const user = useSelector(state => state.user)
  const blogs = useSelector(state => state.blogs) || []

  const dispatch = useDispatch()
  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs()) 
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [dispatch])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password})
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
    } catch (exception){
      dispatch(setNotification('wrong username or password', 'alert', 5))
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    dispatch(setUser(user))
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      dispatch(createBlog(blogObject))
      dispatch(setNotification(`a new blog ${returnedBlog.title} by ${refreshBlog.author} added`, 'success', 5))
    } catch (exception) {
      dispatch(setNotification('Error creating blog', 'alert', 5))
    }
  }

  const addLikes = async(blog) => {
    try {
      dispatch(likeBlog(blog))
      dispatch(setNotification(`You liked ${blog.title}`, 'success', 5))
    } catch (exception) {
      dispatch(setNotification('Error liking blog', 'alert', 5))
    }
  }

  const deleteBlog = async(blog)  => {
    try {
      dispatch(removeBlog(blog))
      dispatch(setNotification(`Blog removed`, 'success', 5))
    } catch (exception) {
      dispatch(setNotification('Error removing blog', 'alert', 5))
    }
  }

    const sortedBlogs = Array.isArray(blogs)
      ? [...blogs].sort((a, b) => b.likes - a.likes)
      : []

  if (user === null) {
    return(
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <LoginForm 
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </div>
    )
  }
  
  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>{user.name} logged in</p>
      <button type='submit' onClick={handleLogout}>logout</button>
      <Togglable buttonLabel="create new blog" ref = {blogFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>

      {sortedBlogs.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
          addLikes={() => addLikes(blog)} 
          deleteBlog={() => deleteBlog(blog)} 
          user={user}
        />
      ))}
    </div>
  )
}

export default App