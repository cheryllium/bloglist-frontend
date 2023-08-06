import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleAddBlog = (event) => {
    event.preventDefault()

    addBlog(title, author, url)
  }

  return (
    <form onSubmit={handleAddBlog}>
      title: <input type='text' value={title} onChange={({ target }) => setTitle(target.value)} /><br />
      author: <input type='text' value={author} onChange={({ target }) => setAuthor(target.value)} /><br />
      url: <input type='text' value={url} onChange={({ target }) => setUrl(target.value)} /><br />
      <button type='submit'>create</button>
    </form>
  )
}

BlogForm.propTypes = {
  addBlog: PropTypes.func.isRequired,
}

export default BlogForm
