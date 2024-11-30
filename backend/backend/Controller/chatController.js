const Chat = require('../Models/chat.schema');
const { io } = require('../app');

// Get chat history between a doctor and a patient
const getChat = async (req, res) => {
  try {
    const { doctorId, patientId } = req.params;

    const chat = await Chat.findOne({ doctorId, patientId }).populate('doctorId patientId');
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Store a new message
const addMessage = async (req, res) => {
    try {
      const { doctorId, patientId, senderId, message } = req.body;
  
      // Validate the doctorId and patientId before proceeding
      if (!doctorId || !patientId) {
        return res.status(400).json({ message: "Doctor ID and Patient ID are required." });
      }
  
      // Find or create a new chat between the doctor and patient
      let chat = await Chat.findOne({ doctorId, patientId });
      if (!chat) {
        chat = new Chat({ doctorId, patientId, messages: [] });
      }
  
      // Add the new message to the chat history
      chat.messages.push({ senderId, message });
      await chat.save();
  
      // Construct the room name
      const room = `${doctorId}-${patientId}`;
  
      // Check if room name is valid
      if (!room) {
        return res.status(500).json({ message: "Invalid room name" });
      }
  
      // Emit the message to the doctor and patient (using socket.io)
      const io = req.app.get("io"); // Access io from app
      io.to(room).emit("receive_message", { senderId, message, timestamp: new Date() });
  
      // Respond with the updated chat
      res.status(201).json(chat);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
module.exports = { getChat, addMessage };
