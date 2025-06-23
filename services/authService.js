const pool = require('../config/bdd');

function login(email, password) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password], (error, results) => {
            if (error) {
                console.error('Error during login:', error);
                return reject(new Error('Login failed'));
            }
            if (results.rows.length === 0) {
                return reject(new Error('Invalid email or password'));
            }
            const user = results.rows[0];
            // Here you would typically generate a JWT token
            resolve({ token: 'dummy-token', user });
        });
    });
}

function register(email, password) {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, password], (error, results) => {
            if (error) {
                console.error('Error during registration:', error);
                return reject(new Error('Registration failed'));
            }
            const user = results.rows[0];
            // Here you would typically generate a JWT token
            resolve({ token: 'dummy-token', user });
        });
    });
}

module.exports = {
    login,
    register
};