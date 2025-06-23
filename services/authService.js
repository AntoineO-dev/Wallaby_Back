const pool = require('../config/bdd');

function login(email, password) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
            if (error) {
                return reject(new Error('Database error'));
            }
            if (results.length === 0) {
                return reject(new Error('Invalid email or password'));
            }
            resolve(results[0]);
        });
    });
}


function register(userData) {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO users (email, password, last_name, first_name, role) VALUES (?, ?, ?, ?, ?) RETURNING *', [userData.email, userData.password, userData.last_name, userData.first_name, userData.role], (error, results) => {
            if (error) {
                return reject(new Error('Database error'));
            }
            resolve(results[0]);
        });
    });
}

module.exports = {
    login,
    register
};