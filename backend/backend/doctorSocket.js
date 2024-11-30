const { getSocketByUserId } = require('./utils/socketManager'); // A custom function to manage socket connections

// Handle doctor socket connections
const doctorSocketHandler = (socket, io) => {
  console.log('Doctor connected:', socket.id);

  // Listen for messages from the doctor
  socket.on('send_message', async (data) => {
    const { doctorId, patientId, senderId, message } = data;

    if (!doctorId || !patientId || !senderId || !message) {
      console.log('Missing required fields');
      return;
    }

    // Create the room based on doctorId and patientId
    const room = `${doctorId}-${patientId}`;

    // Join the room to ensure the doctor is in it
    socket.join(room);
    console.log(`Doctor ${doctorId} joined room ${room}`);

    // Emit the message to the patient in the same room
    const patientSocket = await getSocketByUserId(patientId); // Get patient's socket ID
    if (patientSocket) {
      io.to(patientSocket).emit('receive_message', { senderId, message, timestamp: new Date() });
      console.log(`Message sent from Doctor ${doctorId} to Patient ${patientId}: ${message}`);
    } else {
      console.log(`No socket found for patient ${patientId}`);
    }
  });

  // Handle doctor disconnect
  socket.on('disconnect', () => {
    console.log('Doctor disconnected:', socket.id);
    // Clean up resources or leave rooms if necessary
  });
};

module.exports = doctorSocketHandler;
