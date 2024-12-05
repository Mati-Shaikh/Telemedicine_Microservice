const express = require('express');
const { giveFeedback, getFeedback } = require('../Controller/FeedbackController');
const verifyToken = require('./middleware');

const router = express.Router();

// Route for giving feedback
router.post('/give-feedback/:id',verifyToken, giveFeedback);

// Route for getting feedback
router.get('/get-feedback',verifyToken, getFeedback);

module.exports = router;
