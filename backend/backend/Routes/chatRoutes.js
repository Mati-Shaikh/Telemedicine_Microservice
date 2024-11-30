const express = require('express');
const router = express.Router();
const { getChat, addMessage } = require('../Controller/chatController');

// Get chat history between a doctor and a patient
router.get('/:doctorId/:patientId', getChat);

// Add a new message to the chat
router.post('/message', (req, res) => {
  // Pass the Socket.io instance to the addMessage function
  addMessage(req, res, req.app.get('io'));
});

module.exports = router;
