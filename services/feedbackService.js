const pool = require('../config/bdd');

async function getAllFeedbacks() {
    try {
        const [results] = await pool.query('SELECT * FROM feedback');
        return results;
    } catch (error) {
        console.error('Error fetching all feedbacks:', error);
        throw error;
    }
}

async function getFeedbackById(feedbackId) {
    try {
        const [results] = await pool.query('SELECT * FROM feedback WHERE id_feedback = ?', [feedbackId]);
        if (results.length === 0) {
            return null;
        }
        return results[0];
    } catch (error) {
        console.error('Error fetching feedback by ID:', error);
        throw error;
    }
}

async function getFeedbacksByReservation(reservationId) {
    try {
        const [results] = await pool.query('SELECT * FROM feedback WHERE id_reservation = ?', [reservationId]);
        return results;
    } catch (error) {
        console.error('Error fetching feedback by reservation:', error);
        throw error;
    }
}

async function getFeedbacksByRating(rating) {
    try {
        const [results] = await pool.query('SELECT * FROM feedback WHERE rating = ?', [rating]);
        return results;
    } catch (error) {
        console.error('Error fetching feedback by rating:', error);
        throw error;
    }
}

async function getFeedbacksByRatingAbove(rating) {
    try {
        const [results] = await pool.query('SELECT * FROM feedback WHERE rating >= ?', [rating]);
        return results;
    } catch (error) {
        console.error('Error fetching feedback by rating above:', error);
        throw error;
    }
}

async function getFeedbacksByRatingBelow(rating) {
    try {
        const [results] = await pool.query('SELECT * FROM feedback WHERE rating <= ?', [rating]);
        return results;
    } catch (error) {
        console.error('Error fetching feedback by rating below:', error);
        throw error;
    }
}

async function getAverageRating() {
    try {
        const [results] = await pool.query('SELECT AVG(rating) as average_rating FROM feedback');
        return results[0].average_rating || 0;
    } catch (error) {
        console.error('Error calculating average rating:', error);
        throw error;
    }
}

async function getRoomFeedbacks(roomId) {
    try {
        const [results] = await pool.query(
            `SELECT f.* 
             FROM feedback f
             JOIN reservations r ON f.id_reservation = r.id_reservation
             WHERE r.id_room = ?`, 
            [roomId]
        );
        return results;
    } catch (error) {
        console.error('Error fetching room feedbacks:', error);
        throw error;
    }
}

async function getCustomerFeedbacks(customerId) {
    try {
        const [results] = await pool.query(
            `SELECT f.* 
             FROM feedback f
             JOIN reservations r ON f.id_reservation = r.id_reservation
             WHERE r.id_customer = ?`, 
            [customerId]
        );
        return results;
    } catch (error) {
        console.error('Error fetching customer feedbacks:', error);
        throw error;
    }
}

async function createFeedback(feedbackData) {
    try {
        const { id_reservation, rating, comment, feedback_date } = feedbackData;
        
        // Gestion de la date: utilise la date actuelle si non spécifiée
        const actualFeedbackDate = feedback_date || new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        const [result] = await pool.query(
            'INSERT INTO feedback (id_reservation, rating, comment, feedback_date) VALUES (?, ?, ?, ?)', 
            [id_reservation, rating, comment, actualFeedbackDate]
        );
        
        return result.insertId;
    } catch (error) {
        console.error('Error creating feedback:', error);
        throw error;
    }
}

async function updateFeedback(feedbackId, feedbackData) {
    try {
        const { rating, comment } = feedbackData;
        
        // Construire dynamiquement la requête en fonction des champs fournis
        let updateFields = [];
        let updateValues = [];
        
        if (rating !== undefined) {
            updateFields.push('rating = ?');
            updateValues.push(rating);
        }
        
        if (comment !== undefined) {
            updateFields.push('comment = ?');
            updateValues.push(comment);
        }
        
        // Mettre à jour la date de feedback
        updateFields.push('feedback_date = ?');
        updateValues.push(new Date().toISOString().slice(0, 19).replace('T', ' '));
        
        // Si aucun champ à mettre à jour, retourner false
        if (updateFields.length === 0) {
            return false;
        }
        
        // Ajouter l'ID du feedback aux valeurs pour la clause WHERE
        updateValues.push(feedbackId);
        
        const [result] = await pool.query(
            `UPDATE feedback SET ${updateFields.join(', ')} WHERE id_feedback = ?`,
            updateValues
        );
        
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error updating feedback:', error);
        throw error;
    }
}

async function deleteFeedback(feedbackId) {
    try {
        const [result] = await pool.query('DELETE FROM feedback WHERE id_feedback = ?', [feedbackId]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error deleting feedback:', error);
        throw error;
    }
}

async function getRecentFeedbacks(limit = 10) {
    try {
        const [results] = await pool.query(
            'SELECT * FROM feedback ORDER BY feedback_date DESC LIMIT ?', 
            [limit]
        );
        return results;
    } catch (error) {
        console.error('Error fetching recent feedbacks:', error);
        throw error;
    }
}

async function getFeedbackCount() {
    try {
        const [results] = await pool.query('SELECT COUNT(*) as total FROM feedback');
        return results[0].total;
    } catch (error) {
        console.error('Error counting feedbacks:', error);
        throw error;
    }
}

async function searchFeedbacks(searchTerm) {
    try {
        const [results] = await pool.query(
            'SELECT * FROM feedback WHERE comment LIKE ?', 
            [`%${searchTerm}%`]
        );
        return results;
    } catch (error) {
        console.error('Error searching feedbacks:', error);
        throw error;
    }
}

module.exports = {
    getAllFeedbacks,
    getFeedbackById,
    getFeedbacksByReservation,
    getFeedbacksByRating,
    getFeedbacksByRatingAbove,
    getFeedbacksByRatingBelow,
    getAverageRating,
    getRoomFeedbacks,
    getCustomerFeedbacks,
    createFeedback,
    updateFeedback,
    deleteFeedback,
    getRecentFeedbacks,
    getFeedbackCount,
    searchFeedbacks
};