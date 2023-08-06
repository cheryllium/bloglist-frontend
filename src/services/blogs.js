import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = (title, author, url) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.post(baseUrl, { title, author, url }, config)
  return request.then(response => response.data)
}

const addLike = (blog) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.put(
    `${baseUrl}/${blog.id}`,
    { ...blog, likes: blog.likes + 1, user: blog.user.id },
    config
  )
  return request.then(response => response.data)                         
}

const deleteBlog = (blog) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.delete(
    `${baseUrl}/${blog.id}`,
    config
  )
  return request.then(response => response.data)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { setToken, getAll, create, addLike, deleteBlog }
