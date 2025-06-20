const pool = require('../config/bdd');


function getAllCustomers() {
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

function getCustomersByRegistrationDate(registrationDate) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT first_name, last_name, email, phone FROM customers WHERE registration_date = ?', [registrationDate], (error, results) => {
            if (error) {
                console.error('Error fetching customers by registration date:', error);
                return reject(error);
            }
            resolve(results);
        });
    }
    );
}

function getCustomersByTotalCost(totalCost) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT c.id_customer, c.first_name, c.last_name, c.email SUM(res.total_cost) AS total_spent FROM customers c INNER JOIN reservations res ON c.id_customer = res.id_customer GROUP BY c.id_customer, c.first_name, c.last_name, c.email ORDER BY total_spent DESC', [totalCost], (error, results) => {
            if (error) {
                console.error('Error fetching customers by total cost:', error);
                return reject(error);
            }
            resolve(results);
        });
    }
    );
}

function getCustomersByRoomName(roomName) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT c.first_name, c.last_name, c.email, c.phone FROM customers c INNER JOIN reservations r ON c.id_customer = r.id_customer INNER JOIN rooms ro ON r.id_room = ro.id_room WHERE room_name = ?', [roomName], (error, results) => {
            if (error) {
                console.error('Error fetching customers by room name:', error);
                return reject(error);
            }
            resolve(results);
        });
    }
    );
}

function getCustomerById(customerId) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT first_name, last_name, email, phone, registration_date FROM customers WHERE id = ?', [customerId], (error, results) => {
            if (error) {
                console.error('Error fetching customer by ID:', error);
                return reject(error);
            }
            resolve(results[0]);
        });
    });
}

module.exports = {
    getAllCustomers,
    getCustomerById,
    getCustomersByRegistrationDate,
    getCustomersByTotalCost,
    getCustomersByRoomName
};
