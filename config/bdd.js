const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testDatabaseConnection() {
    try {
        // Exécute une requête simple pour vérifier la connexion
        const [rows] = await pool.query('SELECT 1');
        console.log('✅ Connecté avec succès à la base de données MySQL');
        return true;
    } catch (error) {
        console.error('❌ Erreur de connexion à la base de données:', error.message);
        return false;
    }
}

// Tester la connexion au démarrage
testDatabaseConnection();

module.exports = pool;