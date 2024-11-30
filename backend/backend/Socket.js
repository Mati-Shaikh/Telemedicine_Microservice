const Chat = require("./Models/chat.schema");

const configureSockets = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Join a specific chat room
    socket.on("join_room", ({ doctorId, patientId }) => {
      if (!doctorId || !patientId) {
        console.log("Doctor or Patient ID missing.");
        return;
      }

      const room = `${doctorId}-${patientId}`;
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });

    // Handle sending messages
    socket.on("send_message", async ({ doctorId, patientId, senderId, message }) => {
      const room = `${doctorId}-${patientId}`;
      
      // Check if room exists
      if (!room) {
        console.log("Room is not defined");
        return;
      }

      // Save the message to the database
      let chat = await Chat.findOne({ doctorId, patientId });
      if (!chat) {
        chat = new Chat({ doctorId, patientId, messages: [] });
      }

      chat.messages.push({ senderId, message });
      await chat.save();

      // Emit the message to the room
      io.to(room).emit("receive_message", { senderId, message, timestamp: new Date() });
      console.log("Message emitted to room:", room);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = configureSockets;
