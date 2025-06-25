const pool = require('../config/bdd');

async function login(email, password) {
    try {
        const [results] = await pool.query('SELECT * FROM customers WHERE email = ?', [email]);
        
        if (results.length === 0) {
            return null; // Aucun utilisateur trouvé avec cet email
        }
        
        return results[0]; // Retourne les informations de l'utilisateur
    } catch (error) {
        console.error('Error during login:', error);
        throw new Error('Database error');
    }
}

async function register(userData) {
    try {
        const { email, password, last_name, first_name, role } = userData;
        
        const [result] = await pool.query(
            'INSERT INTO customers (email, password, last_name, first_name, role) VALUES (?, ?, ?, ?, ?)', 
            [email, password, last_name, first_name, role]
        );
        
        // Récupérer l'utilisateur nouvellement créé
        const [newUser] = await pool.query('SELECT * FROM customers WHERE id_customer = ?', [result.insertId]);
        
        return newUser[0];
    } catch (error) {
        console.error('Error during registration:', error);
        // Si l'erreur est due à un email dupliqué, renvoyez un message plus spécifique
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('Email already exists');
        }
        throw new Error('Database error');
    }
}

module.exports = {
    login,
    register
};