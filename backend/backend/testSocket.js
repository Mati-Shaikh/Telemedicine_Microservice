const io = require('socket.io-client');  // Import the socket.io-client package

const socket = io('http://localhost:3001', {
    query: { userId: '674afd092649907c8cebf568' }  // Pass doctorId or patientId here
  });
  
socket.on('connect', () => {
  console.log('Connected to server as socket ID:', socket.id);
});

// Sending a message from the client to the server
const sendMessage = (data) => {
  socket.emit('send_message', data);
  console.log('Message sent:', data);
};

// Listening for messages from the server
socket.on('receive_message', (data) => {
  console.log('Received message:', data);
});
