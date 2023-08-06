import { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    handleLogin(username, password)

    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={handleSubmit}>
      username <input type='text' value={username} onChange={({ target }) => setUsername(target.value)} /><br />
      password <input type='password' value={password} onChange={({ target }) => setPassword(target.value)}/><br />
      <button type='submit'>login</button>
    </form>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
}

export default LoginForm
