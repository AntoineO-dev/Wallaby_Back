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

function getAverageCost() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT AVG(total_cost) AS averageCost FROM reservations', (error, results) => {
            if (error) {
                console.error('Error fetching average cost:', error);
                return reject(error);
            }
            resolve(results[0].averageCost);
        });
    }
    )
}

function getAboveTotalCost(totalCost) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT total_cost, reservation_status, id_reservation FROM reservations WHERE total_cost > ?', [totalCost], (error, results) => {
            if (error) {
                console.error('Error fetching reservations above total cost:', error);
                return reject(error);
            }
            resolve(results);
        });
    });
}

function getBelowTotalCost(totalCost) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT total_cost, reservation_status, id_reservation FROM reservations WHERE total_cost < ?', [totalCost], (error, results) => {
            if (error) {
                console.error('Error fetching reservations below total cost:', error);
                return reject(error);
            }
            resolve(results);
        });
    }
    );
}

function getReservationsByRoomName(roomName) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT r.room_name,r.price_per_night,res.reservation_status,res.total_cost FROM reservations res INNER JOIN rooms r ON res.id_room = r.id_room WHERE res.id_room = ?', [roomName], (error, results) => {
            if (error) {
                console.error('Error fetching reservations by room name:', error);
                return reject(error);
            }
            resolve(results);
        });
    }
    );
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
    getAllReservationsByStatus,
    getAverageCost,
    getAboveTotalCost,
    getBelowTotalCost,
    getReservationsByRoomName
};