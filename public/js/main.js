const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const userList = document.getElementById('users')

// Get username and rooms from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
})

const socket = io()

// Join chatroom
socket.emit('joinroom', { username, room })

// Get room and users
socket.on('roomusers', ({ room, users }) => {
  outputRoomName(room)
  outputUsers(users)
})

// Message from server
socket.on('message', (message) => {
  console.log(message)
  outputMessage(message)

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight
})

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault()

  // Get message text
  const msg = e.target.elements.msg.value

  // Emiting a message to server
  socket.emit('chatMessage', msg)

  // Clear input
  e.target.elements.msg.value = ''
  e.target.elements.msg.focus()
})

// Outuput message to DOM
const outputMessage = (msg) => {
  const div = document.createElement('div')
  div.classList.add('message')
  div.innerHTML = `
    <div class="message">
    <p class="meta">${msg.username} <span>${msg.time}</span></p>
    <p class="text">
      ${msg.text}
    </p>
  </div>
    `

  document.querySelector('.chat-messages').appendChild(div)
}

// Add room name to DOM
const outputRoomName = (roomName) => {
  document.getElementById('room-name').textContent = roomName
}

// Add users to DOM
const outputUsers = (users) => {
  userList.innerHTML = `
    ${users.map((user) => `<li>${user.username}<li>`).join('')}
  `
}
