import { useState, useEffect, useRef } from 'react'
import { Routes, Route, Link, useMatch } from 'react-router-dom'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
// import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Users from './components/Users'
import User from './components/User'
import BlogView from './components/BlogView'
import Menu from './components/Menu'

import blogService from './services/blogs'
import loginService from './services/login'

import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs, createBlog, likeBlog, removeBlog } from './reducers/blogReducer'
import { setUser, clearUser } from './reducers/userReducer'
import blogs from './services/blogs'
import { initializeUsers } from './reducers/usersReducer'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const user = useSelector(state => state.user)
  const users = useSelector(state => state.users)
  const blogs = useSelector(state => state.blogs) || []

  const dispatch = useDispatch()
  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs()) 
    dispatch(initializeUsers())
    dispatch(setUser(user))
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [dispatch])

  const matchUser = useMatch('/users/:id')
  const userProfile = matchUser
    ? users.find(user => user.id === matchUser.params.id)
    : null

  const matchBlog = useMatch('/blogs/:id')
  const blogPost = matchBlog
    ? blogs.find(blog => blog.id === matchBlog.params.id)
    : null

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
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(clearUser())
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
      <Notification />
      <Menu user={user} handleLogout={handleLogout}/>
      
      <h2>blog app</h2>

      <Routes>
        {/* user related */}
        <Route path="/users/:id" element={<User user={userProfile}/>}/>
        <Route path="/users" element={<Users />}/>

        {/* blogs related */}
        {/* single blog related */}
        <Route path="/blogs/:id" element={<BlogView blog={blogPost}/>}/>

        {/* blog list related */}
        <Route path='/' element={
          <div>
            {/* create new button */}
            <Togglable buttonLabel="create new blog">
              <BlogForm />
            </Togglable>

            {/* blogs list  */}
            <div style={{marginTop: 20}}>
              {blogs.map(blog => (
                <div key={blog.id} style={blogStyle}>
                  <Link to={`/blogs/${blog.id}`}>
                  {blog.title} {blog.author}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        }/>
      </Routes>
    </div>
  )
}

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  borderBottom: 5
}

export default App