const pool = require('../config/bdd');

async function getAllReservations() {
    try {
        const [results] = await pool.query('SELECT * FROM reservations');
        return results;
    } catch (error) {
        console.error('Error fetching all reservations:', error);
        throw error;
    }
}

async function getReservationById(reservationId) {
    try {
        const [results] = await pool.query(
            'SELECT * FROM reservations WHERE id_reservation = ?',
            [reservationId]
        );
        
        if (results.length === 0) {
            return null;
        }
        
        return results[0];
    } catch (error) {
        console.error('Error fetching reservation by ID:', error);
        throw error;
    }
}

async function getAllReservationsByStatus(status) {
    try {
        const [results] = await pool.query(
            'SELECT * FROM reservations WHERE reservation_status = ?',
            [status]
        );
        return results;
    } catch (error) {
        console.error('Error fetching reservations by status:', error);
        throw error;
    }
}

async function getAverageCost() {
    try {
        const [results] = await pool.query('SELECT AVG(total_cost) as average_cost FROM reservations');
        return results[0].average_cost || 0;
    } catch (error) {
        console.error('Error calculating average cost:', error);
        throw error;
    }
}

async function getAboveTotalCost(totalCost) {
    try {
        const [results] = await pool.query(
            'SELECT * FROM reservations WHERE total_cost > ?',
            [totalCost]
        );
        return results;
    } catch (error) {
        console.error('Error fetching reservations above total cost:', error);
        throw error;
    }
}

async function getBelowTotalCost(totalCost) {
    try {
        const [results] = await pool.query(
            'SELECT * FROM reservations WHERE total_cost < ?',
            [totalCost]
        );
        return results;
    } catch (error) {
        console.error('Error fetching reservations below total cost:', error);
        throw error;
    }
}

async function getReservationsByRoomName(roomName) {
    try {
        const [results] = await pool.query(
            `SELECT r.* FROM reservations r
             JOIN rooms rm ON r.id_room = rm.id_room
             WHERE rm.room_name = ?`,
            [roomName]
        );
        return results;
    } catch (error) {
        console.error('Error fetching reservations by room name:', error);
        throw error;
    }
}

async function createReservation(reservationData) {
    try {
        const { id_room, id_customer, check_in_date, check_out_date, total_cost, reservation_status } = reservationData;
        
        const [result] = await pool.query(
            'INSERT INTO reservations (id_room, id_customer, check_in_date, check_out_date, total_cost, reservation_status) VALUES (?, ?, ?, ?, ?, ?)',
            [id_room, id_customer, check_in_date, check_out_date, total_cost, reservation_status]
        );
        
        return result.insertId;
    } catch (error) {
        console.error('Error creating reservation:', error);
        throw error;
    }
}

async function updateReservation(reservationId, updatedData) {
    try {
        // Construire dynamiquement la requête en fonction des champs fournis
        let updateFields = [];
        let updateValues = [];
        
        if ('id_room' in updatedData) {
            updateFields.push('id_room = ?');
            updateValues.push(updatedData.id_room);
        }
        if ('id_customer' in updatedData) {
            updateFields.push('id_customer = ?');
            updateValues.push(updatedData.id_customer);
        }
        if ('check_in_date' in updatedData) {
            updateFields.push('check_in_date = ?');
            updateValues.push(updatedData.check_in_date);
        }
        if ('check_out_date' in updatedData) {
            updateFields.push('check_out_date = ?');
            updateValues.push(updatedData.check_out_date);
        }
        if ('total_cost' in updatedData) {
            updateFields.push('total_cost = ?');
            updateValues.push(updatedData.total_cost);
        }
        if ('reservation_status' in updatedData) {
            updateFields.push('reservation_status = ?');
            updateValues.push(updatedData.reservation_status);
        }
        
        // Si aucun champ à mettre à jour, retourner false
        if (updateFields.length === 0) {
            return false;
        }
        
        // Ajouter l'ID de la réservation pour la clause WHERE
        updateValues.push(reservationId);
        
        const [result] = await pool.query(
            `UPDATE reservations SET ${updateFields.join(', ')} WHERE id_reservation = ?`,
            updateValues
        );
        
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error updating reservation:', error);
        throw error;
    }
}

async function deleteReservation(reservationId) {
    try {
        const [result] = await pool.query(
            'DELETE FROM reservations WHERE id_reservation = ?',
            [reservationId]
        );
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error deleting reservation:', error);
        throw error;
    }
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

// Récupérer les détails d'une chambre
async function getRoomDetails(roomId) {
    try {
        const [rooms] = await pool.query(
            'SELECT * FROM rooms WHERE id_room = ?',
            [roomId]
        );
        
        if (rooms.length === 0) {
            throw new Error('Chambre non trouvée');
        }
        
        return rooms[0];
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de la chambre:', error);
        throw error;
    }
}

// Confirmer une réservation
async function confirmReservation(reservationId) {
    try {
        const [result] = await pool.query(
            'UPDATE reservations SET reservation_status = ? WHERE id_reservation = ?',
            ['confirmed', reservationId]
        );
        
        if (result.affectedRows === 0) {
            return false;
        }
        
        // Optionnellement, mettre à jour le statut de la chambre
        const [reservation] = await pool.query(
            'SELECT id_room FROM reservations WHERE id_reservation = ?',
            [reservationId]
        );
        
        if (reservation.length > 0) {
            await pool.query(
                'UPDATE rooms SET status = ? WHERE id_room = ?',
                ['occupied', reservation[0].id_room]
            );
        }
        
        return true;
    } catch (error) {
        console.error('Error confirming reservation:', error);
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
    getRoomDetails,
    confirmReservation
};