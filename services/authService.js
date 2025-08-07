const pool = require('../config/bdd');
const bcrypt = require('bcryptjs');

async function register(userData) {
    try {
        console.log('userData dans service:', userData);
        
        const { email, password, first_name, last_name } = userData;
        
        // Vérifier si l'email existe déjà
        const [existingUser] = await pool.query('SELECT email FROM customers WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            throw new Error('Un compte avec cet email existe déjà');
        }
        
        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insérer le nouvel utilisateur
        const [result] = await pool.query(
            'INSERT INTO customers (email, password, first_name, last_name) VALUES (?, ?, ?, ?)', 
            [email, hashedPassword, first_name, last_name]
        );
        
        // Récupérer l'utilisateur créé
        const [newUser] = await pool.query(
            'SELECT id_customer, email, first_name, last_name FROM customers WHERE id_customer = ?', 
            [result.insertId]
        );
        
        return newUser[0];
    } catch (error) {
        console.error('Erreur service register:', error);
        throw error;
    }
}

async function login(loginData) {
    try {
        const { email, password } = loginData;
        
        const [users] = await pool.query('SELECT * FROM customers WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return null;
        }
        
        return users[0];
    } catch (error) {
        console.error('Erreur service login:', error);
        throw error;
    }
}

module.exports = {
    register,
    login
};