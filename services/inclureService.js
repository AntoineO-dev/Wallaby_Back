const pool = require('/..config/bdd')

function getAllInclude() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM include', (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results.rows);
        });
    }); 
}

function getIncludeByReservationId(id_reservation) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT quantity, total_price FROM include INNER JOIN reservations ON include.id_reservation = reservations.id WHERE include.id_reservation = ?', [id_reservation], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results.rows);
        });
    });
}

function getTotalServicesByReservationId(id_reservation) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT SUM(total_price) as total_services FROM include INNER JOIN reservations ON include.id_reservation = reservations.id_reservation WHERE include.id_reservation = ?', [id_reservation], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results.rows);
        });
    });
}

function getIncludeByRoomName(room_name) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM include INNER JOIN reservations ON include.id_reservation = reservations.id_reservation INNER JOIN rooms ON rooms.id_room = reservations.id_room WHERE room_name = ?', [room_name], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results.rows);
        });
    });
}

function getIncludeById(id) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM include WHERE id_include = ?', [id], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results.rows);
        });
    });
}

function createInclude(data) {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO include SET ?', [data], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results.insertId);
        });
    });
}

function updateInclude(id, data) {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE include SET ? WHERE id_include = ?', [data, id], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results.affectedRows);
        });
    });
}

function deleteInclude(id) {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM include WHERE id_include = ?', [id], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results.affectedRows);
        });
    });
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