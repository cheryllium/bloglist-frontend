import { useState } from 'react'

const Blog = ({blog, addLike, deleteBlog, canDelete}) => {
  const [visible, setVisible] = useState(false)

  return (
    <div className='blog'>
      {blog.title}
      <button onClick={() => setVisible(!visible)}>{visible? 'hide' : 'view'}</button>
      <br />
      <div style={{display: visible? '' : 'none'}}>
        {blog.author}<br />
        {blog.url}<br />
        likes {blog.likes} <button onClick={() => addLike(blog)}>like</button><br />
        {blog.user.name}<br />
        {canDelete && <button onClick={() => deleteBlog(blog)}>remove</button>}
      </div>
    </div>
  )
}

export default Blog
