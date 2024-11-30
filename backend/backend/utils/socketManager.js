// A simple in-memory store for socket connections by userId
const socketMap = new Map();

module.exports = {
  // When a user connects, store their socket ID
  addSocket: (userId, socketId) => {
    socketMap.set(userId, socketId);
  },

  // When a user disconnects, remove their socket ID
  removeSocket: (userId) => {
    socketMap.delete(userId);
  },

  // Get a socket ID by userId
  getSocketByUserId: (userId) => {
    return socketMap.get(userId);
  }
};
