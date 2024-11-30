const socketIo = require('socket.io');
const io = require('socket.io-client'); // To connect to the socket server
const { getSocketByUserId } = require('./utils/socketManager'); // A custom function to manage socket connections

// Handle patient socket connections
const patientSocketHandler = (socket, io) => {
  console.log('Patient connected:', socket.id);

  // Listen for messages from the patient
  socket.on('send_message', async (data) => {
    const { doctorId, patientId, senderId, message } = data;

    if (!doctorId || !patientId || !senderId || !message) {
      console.log('Missing required fields');
      return;
    }

    // Create the room based on doctorId and patientId
    const room = `${doctorId}-${patientId}`;

    // Join the room to ensure the patient is in it
    socket.join(room);
    console.log(`Patient ${patientId} joined room ${room}`);

    // Emit the message to the doctor in the same room
    const doctorSocket = await getSocketByUserId(doctorId); // Get doctor's socket ID
    if (doctorSocket) {
      io.to(doctorSocket).emit('receive_message', { senderId, message, timestamp: new Date() });
      console.log(`Message sent from Patient ${patientId} to Doctor ${doctorId}: ${message}`);
    } else {
      console.log(`No socket found for doctor ${doctorId}`);
    }
  });

  // Handle patient disconnect
  socket.on('disconnect', () => {
    console.log('Patient disconnected:', socket.id);
    // Clean up resources or leave rooms if necessary
  });
};

module.exports = patientSocketHandler;
