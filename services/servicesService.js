const pool = require ('../config/bdd');

function getAllServices() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM services', (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results.rows);
        });
    });
}

function getAvailableServices() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT service_name, description, text FROM services WHERE available = true', (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results.rows);
        });
    });
}

function getServicesAbovePrice(price) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT service_name, description, available FROM services WHERE price > ?', [price], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results.rows);
        });
    });
}

function getServicesByRoomName(roomName) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT service_name, description, available FROM services WHERE room_name = ?', [roomName], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results.rows);
        });
    });
}

function getServicesBelowPrice(price) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT service_name, description, available FROM services WHERE price < ?', [price], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results.rows);
        });
    });
}

function getServiceById(serviceId) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM services WHERE id_service = ?', [serviceId], (error, results) => {
            if (error) {
                return reject(error);
            }
            if (results.rows.length === 0) {
                return reject(new Error('Service not found'));
            }
            resolve(results.rows[0]);
        });
    });
}

function createService(serviceData) {
    return new Promise((resolve, reject) => {
        const { service_name, description, price, available, room_name } = serviceData;
        pool.query('INSERT INTO services (service_name, description, price, available, room_name) VALUES (?, ?, ?, ?, ?)', 
            [service_name, description, price, available, room_name], 
            (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results.rows);
            });
    });
}

function updateService(serviceId, serviceData) {
    return new Promise((resolve, reject) => {
        const { service_name, description, price, available, room_name } = serviceData;
        pool.query('UPDATE services SET service_name = ?, description = ?, price = ?, available = ?, room_name = ? WHERE id_service = ?', 
            [service_name, description, price, available, room_name, serviceId], 
            (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results.rows);
            });
    });
}

function deleteService(serviceId) {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM services WHERE id_service = ?', [serviceId], (error, results) => {
            if (error) {
                return reject(error);
            }
            if (results.affectedRows === 0) {
                return reject(new Error('Service not found'));
            }
            resolve({ message: 'Service deleted successfully' });
        });
    });
}



module.exports = {
    getAllServices,
    getAvailableServices,
    getServicesAbovePrice,
    getServicesByRoomName,
    getServicesBelowPrice,
    getServiceById,
    createService,
    updateService,
    deleteService
};
