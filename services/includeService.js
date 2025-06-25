const pool = require('../config/bdd');

async function getAllInclude() {
    try {
        const [results] = await pool.query('SELECT * FROM include');
        return results;
    } catch (error) {
        console.error('Error fetching all includes:', error);
        throw error;
    }
}

async function getIncludeByReservationId(id_reservation) {
    try {
        const [results] = await pool.query(
            'SELECT quantity, total_price FROM include INNER JOIN reservations ON include.id_reservation = reservations.id WHERE include.id_reservation = ?', 
            [id_reservation]
        );
        return results;
    } catch (error) {
        console.error('Error fetching include by reservation ID:', error);
        throw error;
    }
}

async function getTotalServicesByReservationId(id_reservation) {
    try {
        const [results] = await pool.query(
            'SELECT SUM(total_price) as total_services FROM include INNER JOIN reservations ON include.id_reservation = reservations.id_reservation WHERE include.id_reservation = ?', 
            [id_reservation]
        );
        return results[0];
    } catch (error) {
        console.error('Error calculating total services by reservation ID:', error);
        throw error;
    }
}

async function getIncludeByRoomName(room_name) {
    try {
        const [results] = await pool.query(
            'SELECT * FROM include INNER JOIN reservations ON include.id_reservation = reservations.id_reservation INNER JOIN rooms ON rooms.id_room = reservations.id_room WHERE room_name = ?', 
            [room_name]
        );
        return results;
    } catch (error) {
        console.error('Error fetching include by room name:', error);
        throw error;
    }
}

async function getIncludeById(id) {
    try {
        const [results] = await pool.query(
            'SELECT * FROM include WHERE id_include = ?', 
            [id]
        );
        if (results.length === 0) {
            return null;
        }
        return results[0];
    } catch (error) {
        console.error('Error fetching include by ID:', error);
        throw error;
    }
}

async function createInclude(data) {
    try {
        const [result] = await pool.query(
            'INSERT INTO include SET ?', 
            [data]
        );
        return result.insertId;
    } catch (error) {
        console.error('Error creating include:', error);
        throw error;
    }
}

async function updateInclude(id, data) {
    try {
        const [result] = await pool.query(
            'UPDATE include SET ? WHERE id_include = ?', 
            [data, id]
        );
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error updating include:', error);
        throw error;
    }
}

async function deleteInclude(id) {
    try {
        const [result] = await pool.query(
            'DELETE FROM include WHERE id_include = ?', 
            [id]
        );
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error deleting include:', error);
        throw error;
    }
}

module.exports = {
    getAllInclude,
    getIncludeByReservationId,
    getTotalServicesByReservationId,
    getIncludeByRoomName,
    getIncludeById,
    createInclude,
    updateInclude,
    deleteInclude
};