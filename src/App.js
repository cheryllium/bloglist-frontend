import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  // Notifications
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')

  // Load initial blogs list
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  // Load user from localStorage if exists
  useEffect(() => {
    const userJSON = window.localStorage.getItem('blogsUser')
    if (userJSON) {
      const user = JSON.parse(userJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // Handle log in
  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      window.localStorage.setItem('blogsUser', JSON.stringify(user))

      setUser(user)
    } catch (exception) {
      setErrorMessage("wrong username or password")
    }
  }

  // Handle log out
  const handleLogout = () => {
    window.localStorage.removeItem('blogsUser')
    setUser(null)
  }

  // Handle add a blog
  const handleAddBlog = (title, author, url) => {
    blogService.create(title, author, url)
      .then(data => {
        setBlogs(blogs.concat(data))
        setSuccessMessage("Blog created")
      })
      .catch(error => {
        setErrorMessage("Something went wrong")
      })
  }

  // Handle liking a blog
  const handleAddLike = (blog) => {
    blogService.addLike(blog)
      .then(data => {
        setBlogs(blogs.map(
          b => {
            if(b.id === blog.id) {
              return { ...b, likes: b.likes + 1 }
            }
            return b
          }
        ))
      })
      .catch(error => {
        setErrorMessage("Something went wrong")
      })
  }

  // Handle deleting a blog
  const handleDeleteBlog = (blog) => {
    if(window.confirm(`Are you sure you want to delete ${blog.title}?`)) {
      blogService.deleteBlog(blog)
        .then(() => {
          setBlogs(blogs.filter(
            b => b.id !== blog.id
          ))
        })
        .catch(error => {
          setErrorMessage(error.error)
        })
    }
  }
  
  // Set error or success notifications
  const setErrorMessage = message => {
    setMessage(message)
    setStatus('error')
    setTimeout(() => {
      setMessage('')
      setStatus('')
    }, 5000)
  }

  const setSuccessMessage = message => {
    setMessage(message)
    setStatus('success')
    setTimeout(() => {
      setMessage('')
      setStatus('')
    }, 5000)
  }

  // Sort by number of likes
  const sortedBlogs = blogs.sort(
    (a, b) => a.likes < b.likes
  )
  
  if(!user) {
    return (
      <div>
        <h2>log in to application</h2>
        {message && <Notification message={message} status={status} />}
        <LoginForm handleLogin={handleLogin} />
      </div>
    )
  } else {
    return (
      <div>
        <h2>blogs</h2>
        {message && <Notification message={message} status={status} />}
        
        <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

        <Togglable buttonLabel='create new blog'>
          <BlogForm addBlog={handleAddBlog} />
        </Togglable>
        
        {sortedBlogs.map(blog =>
          <Blog key={blog.id} blog={blog} addLike={handleAddLike} deleteBlog={handleDeleteBlog} canDelete={user.username === blog.user.username} />
        )}
      </div>
    )
  }
}

export default App
