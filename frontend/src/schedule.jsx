import { useState, useEffect } from "react"

const Schedule = () => {

  const [users, setUsers] = useState(null)
  const [schedule, setSchedule] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)

      useEffect(() => {
      fetch('/api/users')
        .then((response) => response.json())
        .then((result) => {
          setUsers(result)
          console.log(result)
        })
      fetch('/api/schedule')
        .then((response) => response.json())
        .then((result) => {
          setSchedule(result)
          console.log(result)
        })
    }, [])

  return (
    <>
    {users && users.map(user => <button key={user.id} style={{backgroundColor: selectedUser === user.id ? 'green' : 'grey'}} onClick={() => {setSelectedUser(user.id)} } >{user.name}</button>)}
    <div style={{display: 'flex', flexWrap: 'wrap'}}>
    {schedule && schedule.map(time =>
    <div
      key={time.id}
      onClick={() => bookTime(time.id, selectedUser)}
      style={{flex: '33%', marginTop: '10px', cursor: 'pointer'}}
    >{time.slot}</div>)}
    </div>
    </>
  )
}

const bookTime = (time, user) => {
  console.log('bookTime id: ', time)
  console.log('bookTime userName: ', user)
  if(user){
    fetch(`/api/book?timeSlot=${encodeURIComponent(time)}&user=${encodeURIComponent(user)}`)
        .then((response) => response.json())
        .then((result) => {
          console.log(result)
        })
  }
}

export default Schedule;
