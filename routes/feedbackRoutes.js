const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const authController = require('../controllers/authController');

// /feedback
router.get('/', (req, res) => { feedbackController.getAllFeedback(req, res) });

// /feedback/room/:room_name
router.get('/room/:room_name', (req, res) => { feedbackController.getFeedbackByRoomName(req, res) });

// /feedback/:id
router.get('/:id', (req, res) => { feedbackController.getFeedbackById(req, res) });

// POST /feedback
router.post('/', authController.verifyToken, (req, res) => { feedbackController.createFeedback(req, res) });

// PATCH /feedback/:id
router.patch('/:id', authController.verifyToken, (req, res) => { feedbackController.updateFeedback(req, res) });

// DELETE /feedback/:id
router.delete('/:id', authController.verifyToken, (req, res) => { feedbackController.deleteFeedback(req, res) });

module.exports = router;