const pool = require('../config/bdd');

async function getAllServices() {
    try {
        const [results] = await pool.query('SELECT * FROM services');
        return results;
    } catch (error) {
        console.error('Error fetching all services:', error);
        throw error;
    }
}

async function getAvailableServices() {
    try {
        const [results] = await pool.query('SELECT service_name, description, text FROM services WHERE available = true');
        return results;
    } catch (error) {
        console.error('Error fetching available services:', error);
        throw error;
    }
}

async function getServicesAbovePrice(price) {
    try {
        const [results] = await pool.query(
            'SELECT service_name, description, available FROM services WHERE price > ?', 
            [price]
        );
        return results;
    } catch (error) {
        console.error('Error fetching services above price:', error);
        throw error;
    }
}

async function getServicesByRoomName(roomName) {
    try {
        const [results] = await pool.query(
            'SELECT service_name, description, available FROM services WHERE room_name = ?', 
            [roomName]
        );
        return results;
    } catch (error) {
        console.error('Error fetching services by room name:', error);
        throw error;
    }
}

async function getServicesBelowPrice(price) {
    try {
        const [results] = await pool.query(
            'SELECT service_name, description, available FROM services WHERE price < ?', 
            [price]
        );
        return results;
    } catch (error) {
        console.error('Error fetching services below price:', error);
        throw error;
    }
}

async function getServiceById(serviceId) {
    try {
        const [results] = await pool.query(
            'SELECT * FROM services WHERE id_service = ?', 
            [serviceId]
        );
        if (results.length === 0) {
            throw new Error('Service not found');
        }
        return results[0];
    } catch (error) {
        console.error('Error fetching service by ID:', error);
        throw error;
    }
}

async function createService(serviceData) {
    try {
        const { service_name, description, price, available, room_name } = serviceData;
        const [result] = await pool.query(
            'INSERT INTO services (service_name, description, price, available, room_name) VALUES (?, ?, ?, ?, ?)', 
            [service_name, description, price, available, room_name]
        );
        
        // Récupérer le service nouvellement créé
        if (result.insertId) {
            const [newService] = await pool.query('SELECT * FROM services WHERE id_service = ?', [result.insertId]);
            return newService[0];
        }
        return null;
    } catch (error) {
        console.error('Error creating service:', error);
        throw error;
    }
}

async function updateService(serviceId, serviceData) {
    try {
        const { service_name, description, price, available, room_name } = serviceData;
        const [result] = await pool.query(
            'UPDATE services SET service_name = ?, description = ?, price = ?, available = ?, room_name = ? WHERE id_service = ?', 
            [service_name, description, price, available, room_name, serviceId]
        );
        
        if (result.affectedRows === 0) {
            throw new Error('Service not found');
        }
        
        // Récupérer le service mis à jour
        const [updatedService] = await pool.query('SELECT * FROM services WHERE id_service = ?', [serviceId]);
        return updatedService[0];
    } catch (error) {
        console.error('Error updating service:', error);
        throw error;
    }
}

async function deleteService(serviceId) {
    try {
        const [result] = await pool.query(
            'DELETE FROM services WHERE id_service = ?', 
            [serviceId]
        );
        
        if (result.affectedRows === 0) {
            throw new Error('Service not found');
        }
        
        return { message: 'Service deleted successfully' };
    } catch (error) {
        console.error('Error deleting service:', error);
        throw error;
    }
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