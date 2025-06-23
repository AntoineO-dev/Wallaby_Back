const feedbackService = require('../services/feedbackService');

async function getAllFeedback(req, res) {
    try {
        const feedback = await feedbackService.getAllFeedback();
        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving feedback', error });
    }
}

async function getFeedbackByRoomName(req, res) {
    const roomName = req.params.room_name;
    if (!roomName) {
        return res.status(400).json({ message: 'Room name parameter is required' });
    }
    try {
        const feedback = await feedbackService.getFeedbackByRoomName(roomName);
        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving feedback by room name', error });
    }
}

async function getFeedbackById(req, res) {
    const feedbackId = req.params.id;
    if (!feedbackId) {
        return res.status(400).json({ message: 'Feedback ID parameter is required' });
    }
    try {
        const feedback = await feedbackService.getFeedbackById(feedbackId);
        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving feedback by ID', error });
    }
}

async function createFeedback(req, res) {
    const feedbackData = req.body;
    if (!feedbackData || !feedbackData.room_name || !feedbackData.comment) {
        return res.status(400).json({ message: 'Room name and comment are required' });
    }
    try {
        const newFeedback = await feedbackService.createFeedback(feedbackData);
        res.status(201).json(newFeedback);
    } catch (error) {
        res.status(500).json({ message: 'Error creating feedback', error });
    }
}

async function updateFeedback(req, res) {
    const feedbackId = req.params.id;
    const feedbackData = req.body;
    if (!feedbackId || !feedbackData) {
        return res.status(400).json({ message: 'Feedback ID and data are required' });
    }
    try {
        const updatedFeedback = await feedbackService.updateFeedback(feedbackId, feedbackData);
        res.status(200).json(updatedFeedback);
    } catch (error) {
        res.status(500).json({ message: 'Error updating feedback', error });
    }
}

async function deleteFeedback(req, res) {
    const feedbackId = req.params.id;
    if (!feedbackId) {
        return res.status(400).json({ message: 'Feedback ID parameter is required' });
    }
    try {
        await feedbackService.deleteFeedback(feedbackId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting feedback', error });
    }
}

module.exports = {
    getAllFeedback,
    getFeedbackByRoomName,
    getFeedbackById,
    createFeedback,
    updateFeedback,
    deleteFeedback
};