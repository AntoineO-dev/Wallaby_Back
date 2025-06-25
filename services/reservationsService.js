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

function createReservation(reservationData) {
    return new Promise((resolve, reject) => {
        const { id_customer, id_room, reservation_status, total_cost, check_in_date, check_out_date } = reservationData;
        pool.query('INSERT INTO reservations (id_customer, id_room, reservation_status, total_cost, check_in_date, check_out_date) VALUES (?, ?, ?, ?, ?, ?)', 
            [id_customer, id_room, reservation_status, total_cost, check_in_date, check_out_date], 
            (error, results) => {
                if (error) {
                    console.error('Error creating reservation:', error);
                    return reject(error);
                }
                resolve(results.insertId); // Return the ID of the newly created reservation
            });
    });
}

function updateReservation(reservationId, updatedData) {
    return new Promise((resolve, reject) => {
        const { id_customer, id_room, reservation_status, total_cost, check_in_date, check_out_date } = updatedData;
        pool.query('UPDATE reservations SET id_customer = ?, id_room = ?, reservation_status = ?, total_cost = ?, check_in_date = ?, check_out_date = ? WHERE id_reservation = ?', 
            [id_customer, id_room, reservation_status, total_cost, check_in_date, check_out_date, reservationId], 
            (error, results) => {
                if (error) {
                    console.error('Error updating reservation:', error);
                    return reject(error);
                }
                resolve(results.affectedRows > 0);
            });
    });
}

function deleteReservation(reservationId) {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM reservations WHERE id_reservation = ?', [reservationId], (error, results) => {
            if (error) {
                console.error('Error deleting reservation:', error);
                return reject(error);
            }
            resolve(results.affectedRows > 0);
        });
    });
}   


// Vérifier la disponibilité d'une chambre pour une période donnée
async function checkRoomAvailability(roomId, checkInDate, checkOutDate) {
    try {
        // Convertir les dates en format SQL
        const sqlCheckInDate = new Date(checkInDate).toISOString().split('T')[0];
        const sqlCheckOutDate = new Date(checkOutDate).toISOString().split('T')[0];
        
        // Vérifier d'abord si la chambre existe
        const [rooms] = await pool.query(
            'SELECT * FROM rooms WHERE id_room = ?',
            [roomId]
        );
        
        if (rooms.length === 0) {
            throw new Error('La chambre demandée n\'existe pas');
        }
        
        // Vérifier la disponibilité
        const [overlappingReservations] = await pool.query(
            `SELECT id_reservation, check_in_date, check_out_date 
             FROM reservations 
             WHERE id_room = ? 
             AND reservation_status != 'cancelled'
             AND (
                (check_in_date <= ? AND check_out_date > ?) OR
                (check_in_date < ? AND check_out_date >= ?) OR
                (check_in_date >= ? AND check_out_date <= ?)
             )`,
            [roomId, sqlCheckOutDate, sqlCheckInDate, sqlCheckOutDate, sqlCheckInDate, sqlCheckInDate, sqlCheckOutDate]
        );
        
        return {
            isAvailable: overlappingReservations.length === 0,
            conflictingReservations: overlappingReservations
        };
    } catch (error) {
        console.error('Erreur lors de la vérification de disponibilité:', error);
        throw error;
    }
}




module.exports = {
    getAllReservations,
    getReservationById,
    getAllReservationsByStatus,
    getAverageCost,
    getAboveTotalCost,
    getBelowTotalCost,
    getReservationsByRoomName,
    createReservation,
    updateReservation,
    deleteReservation,
    checkRoomAvailability,

};