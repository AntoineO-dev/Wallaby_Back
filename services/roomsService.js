const pool = require('../config/bdd');

function getAllRooms() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM rooms', (error, results) => {
            if (error) {
                console.error('Error fetching all rooms:', error);
                return reject(error);
            }
            resolve(results.rows);
        });
    });
}

function getAvailableRooms() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT room_name, capacity, price_per_night, status, description FROM rooms WHERE status = true', (error, results) => {
            if (error) {
                console.error('Error fetching available rooms:', error);
                return reject(error);
            }
            resolve(results.rows);
        });
    });
}

function getRoomsAbovePrice(pricePerNight) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT room_name,price_per_night, status, description FROM rooms WHERE price_per_night > ?', [pricePerNight], (error, results) => {
            if (error) {
                console.error('Error fetching rooms above price:', error);
                return reject(error);
            }
            resolve(results.rows);
        });
    });
}

function getRoomsBelowPrice(pricePerNight) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT room_name, price_per_night, status, description FROM rooms WHERE price_per_night < ?', [pricePerNight], (error, results) => {
            if (error) {
                console.error('Error fetching rooms below price:', error);
                return reject(error);
            }
            resolve(results.rows);
        });
    });
}

function getRoomByName(roomName) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT room_name, status, description, price_per_night FROM rooms WHERE room_name = ?', [roomName], (error, results) => {
            if (error) {
                console.error('Error fetching room by name:', error);
                return reject(error);
            }
            if (results.rows.length === 0) {
                return resolve(null); // No room found
            }
            resolve(results.rows[0]);
        });
    });
}

function getRoomsByCapacity(capacity) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT room_name, capacity, price_per_night, status, description FROM rooms WHERE capacity >= ?', [capacity], (error, results) => {
            if (error) {
                console.error('Error fetching rooms by capacity:', error);
                return reject(error);
            }
            resolve(results.rows);
        });
    });
}

function getRoomById(roomId) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM rooms WHERE id = ?', [roomId], (error, results) => {
            if (error) {
                console.error('Error fetching room by ID:', error);
                return reject(error);
            }
            if (results.rows.length === 0) {
                return resolve(null); // No room found
            }
            resolve(results.rows[0]);
        });
    });
}

module.exports = {
    getAllRooms,
    getRoomById,
    getAvailableRooms,
    getRoomsAbovePrice,
    getRoomsBelowPrice,
    getRoomByName,
    getRoomsByCapacity
};