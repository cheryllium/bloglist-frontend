const Notification = ({ message, status }) => (
  <div className={`notification ${status}`}>
    {message}
  </div>
)

export default Notification
