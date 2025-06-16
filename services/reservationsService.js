const pool = require('../config/bdd');

function getAllReservations() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM reservations', (error, results) => {
            if (error) {
                console.error('Error fetching reservations:', error);
                return reject(error);
            }
            resolve(results);
        });
    });
}

function getAllReservationsByStatus(reservationStatus) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM reservations WHERE status = ?', [reservationStatus], (error, results) => {
            if (error) {
                console.error('Error fetching reservations by status:', error);
                return reject(error);
            }
            resolve(results);
        });
    });
    }

function getReservationById(reservationId) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM reservations WHERE id = ?', [reservationId], (error, results) => {
            if (error) {
                console.error('Error fetching reservation:', error);
                return reject(error);
            }
            if (results.length === 0) {
                return resolve(null); // No reservation found
            }
            resolve(results[0]);
        });
    });
}

module.exports = {
    getAllReservations,
    getReservationById,
    getAllReservationsByStatus
};