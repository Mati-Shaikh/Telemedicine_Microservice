const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const { addSocket, removeSocket, getSocketByUserId } = require('./utils/socketManager');
const Chat = require('./Models/chat.schema'); // Import the Chat model
const UserRoute = require('./Routes/auth');
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());

const cors = require("cors");
app.use(cors());


// MongoDB connection
const mongoUri = 'mongodb://localhost:27017/telemedicine'; // Replace with your MongoDB URI
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// POST request to send message
app.post('/send_message', async (req, res) => {
  const { doctorId, patientId, senderId, message } = req.body;

  if (!doctorId || !patientId || !senderId || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Save message to MongoDB
  try {
    // Find or create a chat document between doctor and patient
    let chat = await Chat.findOne({ doctorId, patientId });

    if (!chat) {
      // If no chat exists, create a new one
      chat = new Chat({ doctorId, patientId, messages: [] });
    }

    // Add the new message to the chat history
    chat.messages.push({ senderId, message, timestamp: new Date() });

    // Save the chat to the database
    await chat.save();

    // Find the sockets for doctor and patient
    const doctorSocket = getSocketByUserId(doctorId);
    const patientSocket = getSocketByUserId(patientId);

    // Emit message to doctor if socket found
    if (doctorSocket) {
      io.to(doctorSocket).emit('receive_message', { senderId, message, timestamp: new Date() });
      console.log(`Message sent from Patient ${senderId} to Doctor ${doctorId}: ${message}`);
    } else {
      console.log(`No socket found for doctor ${doctorId}`);
    }

    // Emit message to patient if socket found
    if (patientSocket) {
      io.to(patientSocket).emit('receive_message', { senderId, message, timestamp: new Date() });
      console.log(`Message sent from Doctor ${senderId} to Patient ${patientId}: ${message}`);
    } else {
      console.log(`No socket found for patient ${patientId}`);
    }

    return res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error saving chat:', error);
    return res.status(500).json({ error: 'Failed to save the chat' });
  }
});

// Endpoint to get chat history for a doctor-patient pair
app.get('/get_chat_history', async (req, res) => {
  const { doctorId, patientId } = req.query;

  if (!doctorId || !patientId) {
    return res.status(400).json({ error: 'Missing doctorId or patientId' });
  }

  try {
    // Find the chat history between doctor and patient
    const chat = await Chat.findOne({ doctorId, patientId });

    if (!chat) {
      return res.status(404).json({ message: 'No chat history found' });
    }

    return res.status(200).json({ messages: chat.messages });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return res.status(500).json({ error: 'Failed to retrieve chat history' });
  }
});
app.get("/",async(req,res)=> {
   res.status(200).json({ Message: 'Successfuly' });
})
// Socket connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // When a user connects, add their socketId
  const userId = socket.handshake.query.userId;
  if (userId) {
    addSocket(userId, socket.id);  // Store the user's socket ID
    console.log('User connected with ID:', userId);
  }

  // Handle disconnections
  socket.on('disconnect', () => {
    removeSocket(userId);  // Remove the socket ID when the user disconnects
    console.log('User disconnected:', userId);
  });
});


app.use("/auth", UserRoute);
// Start the server
app.listen(3001, '0.0.0.0',() => {
  console.log('Backend is running on port 3001');
});
