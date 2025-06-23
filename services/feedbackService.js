const pool = require('../config/bdd');

function getAllFeedback() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM feedback', (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results.rows);
        });
    });
}

function getFeedbackByRoomName(roomName) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT rating, comment, feedback_date FROM feedback INNER JOIN customers ON feedback.id_customer = customers.id_customer INNER JOIN reservations ON reservations.id_customer = customers.id_customer INNER JOIN rooms ON rooms.id_room = reservations.id_room WHERE room_name = ?', [roomName], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results.rows);
        });
    }); 
}

function getFeedbackById(feedbackId) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM feedback WHERE id_feedback = ?', [feedbackId], (error, results) => {
            if (error) {
                return reject(error);
            }
            if (results.rows.length === 0) {
                return reject(new Error('Feedback not found'));
            }
            resolve(results.rows[0]);
        });
    });
}

function createFeedback(feedbackData) {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO feedback (id_customer, id_room, rating, comment, feedback_date) VALUES (?, ?, ?, ?, ?)', [feedbackData.id_customer, feedbackData.id_room, feedbackData.rating, feedbackData.comment, feedbackData.feedback_date], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve({ id_feedback: results.insertId, ...feedbackData });
        });
    });
}

function updateFeedback(feedbackId, feedbackData) {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE feedback SET rating = ?, comment = ?, feedback_date = ? WHERE id_feedback = ?', [feedbackData.rating, feedbackData.comment, feedbackData.feedback_date, feedbackId], (error, results) => {
            if (error) {
                return reject(error);
            }
            if (results.affectedRows === 0) {
                return reject(new Error('Feedback not found'));
            }
            resolve({ id_feedback: feedbackId, ...feedbackData });
        });
    });
}

function deleteFeedback(feedbackId) {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM feedback WHERE id_feedback = ?', [feedbackId], (error, results) => {
            if (error) {
                return reject(error);
            }
            if (results.affectedRows === 0) {
                return reject(new Error('Feedback not found'));
            }
            resolve();
        });
    });
}

module.exports = {
    getAllFeedback,
    getFeedbackByRoomName,
    getFeedbackById,
    createFeedback,
    updateFeedback,
    deleteFeedback
};