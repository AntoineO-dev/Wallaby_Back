const express = require('express');
const app = express();
require('dotenv').config();   
const cors = require('cors');
const pool = require('./config/bdd');
const reservationsRoutes = require('./routes/reservationsRoutes');
const authRoutes = require('./routes/authRoutes');
const roomsRoutes = require('./routes/roomsRoutes');
const paymentsRoutes = require('./routes/paymentsRoutes');
const includeRoutes = require('./routes/includeRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const customerRoutes = require('./routes/customerRoutes');
const payRoutes = require('./routes/payRoutes');

app.use(express.json());
app.use(cors()); // Middleware pour autoriser les requêtes CORS

app.use('/api/reservations', reservationsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/include', includeRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/pay', payRoutes);
app.use('/api/customers', customerRoutes);

// Fonction de démarrage du serveur après vérification de la connexion BDD
async function startServer() {
  try {
    // Vérifier la connexion à la base de données
    await pool.query('SELECT 1');
    console.log('✅ Connexion à la BDD vérifiée');
    
    // Démarrer le serveur si la connexion à la BDD est OK
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Serveur démarré sur le port ${process.env.PORT || 3000}`);
    });
  } catch (error) {
    console.error('❌ Impossible de démarrer le serveur:', error.message);
    process.exit(1);
  }
}


startServer();

