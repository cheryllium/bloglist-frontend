import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  // Login form
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Notifications
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')

  // Create blog form
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const userJSON = window.localStorage.getItem('blogsUser')
    if (userJSON) {
      const user = JSON.parse(userJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])
  
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      window.localStorage.setItem('blogsUser', JSON.stringify(user))

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage("wrong username or password")
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('blogsUser')
    setUser(null)
  }

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

  const handleAddBlog = (event) => {
    event.preventDefault()
    
    blogService.create(title, author, url)
      .then(data => {
        console.log(data)

        setBlogs(blogs.concat(data))
        
        setSuccessMessage("Blog created")
      })
      .catch(error => {
        setErrorMessage("Something went wrong")
      })
  }
  
  if(!user) {
    return (
      <div>
        <h2>log in to application</h2>
        {message && <Notification message={message} status={status} />}
        <form onSubmit={handleSubmit}>
          username <input type='text' value={username} onChange={({ target }) => setUsername(target.value)} /><br />
          password <input type='password' value={password} onChange={({ target }) => setPassword(target.value)}/><br />
          <button type='submit'>login</button>
        </form>
      </div>
    )
  } else {
    return (
      <div>
        <h2>blogs</h2>
        {message && <Notification message={message} status={status} />}
        
        <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

        <form onSubmit={handleAddBlog}>
          title: <input type='text' value={title} onChange={({ target }) => setTitle(target.value)} /><br />
          author: <input type='text' value={author} onChange={({ target }) => setAuthor(target.value)} /><br />
          url: <input type='text' value={url} onChange={({ target }) => setUrl(target.value)} /><br />
          <button type='submit'>create</button>
        </form>
        
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
  }
}

export default App
