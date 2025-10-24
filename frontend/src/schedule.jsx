import { useState, useEffect } from "react"

const Schedule = () => {

  const [users, setUsers] = useState(null)
  const [schedule, setSchedule] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [updateBookings, setUpdateBookings] = useState(1)

    useEffect(() => {
      fetch('/api/users')
        .then((response) => response.json())
        .then((result) => {
          setUsers(result)
          console.log(result)
        })
    }, [updateBookings])

    useEffect(() => {
      fetch('/api/schedule')
        .then((response) => response.json())
        .then((result) => {
          setSchedule(result)
          console.log(result)
        })
    }, [])

  const bookTime = (time, user, users) => {

    if (!user) return

    const bookedBy = users.find(u => u.slotid === time);

    if (bookedBy && bookedBy.userid === user) {
      fetch(`/api/unbook?user=${encodeURIComponent(user)}`)
        .then((response) => response.json())
        .then(() => {
          setUpdateBookings(prev => prev + 1)
        })
        return
    }
    if (bookedBy && bookedBy.userid !== user) {
      console.log(bookedBy)
      alert(`Denna tid är redan bokad av ${bookedBy.username}!`);
      return;
    }

    fetch(`/api/book?timeSlot=${encodeURIComponent(time)}&user=${encodeURIComponent(user)}`)
        .then((response) => response.json())
        .then(() => {
          setUpdateBookings(prev => prev + 1)
        })
  }

  return (
    <>
    {users && users.map(user => <button key={user.userid} style={{backgroundColor: selectedUser === user.userid ? 'green' : 'grey'}} onClick={() => {setSelectedUser(user.userid)} } >{user.username}</button>)}
    <div style={{display: 'flex', flexWrap: 'wrap'}}>
    {schedule && schedule.map(time =>{

        const isSelectedUserBooked = selectedUser && Number(users.find(u => u.userid === selectedUser)?.slotid || -1 ) === Number(time.slotid);

        const isOtherUserBooked = users.some(u => u.userid !== selectedUser && Number(u.slotid) === Number(time.slotid));


        let bgColor = 'grey'; // ledig
        if (isSelectedUserBooked) bgColor = 'green';
        else if (isOtherUserBooked) bgColor = 'red';

      return (
        <div
          key={time.slotid}
          onClick={() => bookTime(time.slotid, selectedUser, users)}
          style={{
            backgroundColor: bgColor,
            flex: '33%',
            marginTop: '10px',
            cursor: 'pointer'}}
        >{time.slot}</div>
      )
    })
    }
    </div>
    </>
  )
}

export default Schedule;
