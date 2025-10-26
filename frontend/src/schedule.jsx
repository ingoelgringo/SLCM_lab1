import { useState, useEffect } from "react";

const Schedule = () => {
  const [users, setUsers] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updateBookings, setUpdateBookings] = useState(1);
  const [newUser, setNewUser] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");

  useEffect(() => {
    fetch("/api/users")
      .then((response) => response.json())
      .then((result) => {
        setUsers(result);
      });
  }, [updateBookings]);

  useEffect(() => {
    fetch("/api/schedule")
      .then((response) => response.json())
      .then((result) => {
        setSchedule(result);
      });
  }, []);

  useEffect(() => {
    if (users) {
      const user = users.find((u) => u.userid === selectedUser);
      setSelectedUserName(user ? user.username : null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser, users]);

  const chooseUser = (userid) => {
    if (selectedUser === userid) {
      setSelectedUser(null);
    } else {
      setSelectedUser(userid);
    }
  };

  const bookTime = (time, selectedUser, users) => {
    if (!selectedUser) return;

    const bookedBy = users.find((u) => u.slotid === time);

    if (bookedBy && bookedBy.userid === selectedUser) {
      fetch(`/api/unbook?user=${encodeURIComponent(selectedUser)}`)
        .then((response) => response.json())
        .then(() => {
          setUpdateBookings((prev) => prev + 1);
        });

      return;
    }
    if (bookedBy && bookedBy.userid !== selectedUser) return;

    fetch(
      `/api/book?timeSlot=${encodeURIComponent(time)}&user=${encodeURIComponent(selectedUser)}`
    )
      .then((response) => response.json())
      .then(() => {
        setUpdateBookings((prev) => prev + 1);
      });
  };

  const addUser = (newUser) => {
    if (newUser) {
      fetch(`/api/addUser`, {
        body: `{ "name": "${newUser}" }`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      })
        .then((response) => response.json())
        .then(() => {
          setNewUser("");
          setUpdateBookings((prev) => prev + 1);
        });
      return;
    } else return;
  };

  const deleteUser = (user) => {
    if (user) {
      fetch(`/api/deleteUser?user=${encodeURIComponent(selectedUser)}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then(() => {
          setUpdateBookings((prev) => prev + 1);
        });
      return;
    } else return;
  };

  return (
    <>
      <div>
        <input
          type="string"
          placeholder="Username"
          value={newUser}
          onChange={(e) => {
            setNewUser(e.target.value);
          }}
        />
        <button onClick={() => addUser(newUser)}>Add user</button>
        {selectedUserName && (
          <button
            onClick={() => {
              deleteUser(selectedUser);
            }}
          >
            Delete {selectedUserName}
          </button>
        )}
      </div>
      {users &&
        users.map((user) => (
          <button
            key={user.userid}
            style={{
              backgroundColor: selectedUser === user.userid ? "green" : "grey",
            }}
            onClick={() => chooseUser(user.userid)}
          >
            {user.username}
          </button>
        ))}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {schedule &&
          schedule.map((time) => {
            const isSelectedUserBooked =
              selectedUser &&
              Number(
                users.find((u) => u.userid === selectedUser)?.slotid || -1
              ) === Number(time.slotid);

            const isOtherUserBooked = users.some(
              (u) =>
                u.userid !== selectedUser &&
                Number(u.slotid) === Number(time.slotid)
            );

            const bookedBy = users.find(
              (u) => Number(u.slotid) === Number(time.slotid)
            );

            let tooltipText;

            let bgColor = "grey"; // ledig
            if (isSelectedUserBooked) bgColor = "green";
            else if (isOtherUserBooked) bgColor = "red";

            if (bookedBy) tooltipText = `Bokad av ${bookedBy.username}`;

            return (
              <div
                key={time.slotid}
                onClick={() => bookTime(time.slotid, selectedUser, users)}
                title={tooltipText}
                style={{
                  backgroundColor: bgColor,
                  flex: "33%",
                  marginTop: "10px",
                  cursor: "pointer",
                }}
              >
                {time.slot}
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Schedule;
