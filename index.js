const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
require('dotenv').config();   
const cors = require('cors');
const pool = require('./config/bdd');

// Import des routes
const reservationsRoutes = require('./routes/reservationsRoutes');
const authRoutes = require('./routes/authRoutes');
const roomsRoutes = require('./routes/roomsRoutes');
const paymentsRoutes = require('./routes/paymentsRoutes');
const includeRoutes = require('./routes/includeRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const customerRoutes = require('./routes/customerRoutes');
const payRoutes = require('./routes/payRoutes');
const servicesRoutes = require('./routes/servicesRoutes');

// ✅ CONFIGURATION CORRECTE DES MIDDLEWARES
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware de debug - APRÈS les parsers
app.use((req, res, next) => {
    console.log('📥 Method:', req.method);
    console.log('📥 URL:', req.url);
    console.log('📥 Content-Type:', req.headers['content-type']);
    console.log('📥 Body:', req.body);
    next();
});

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

app.use('/public', express.static('public'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/reservations', reservationsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/include', includeRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/pay', payRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/services', servicesRoutes);

async function startServer() {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Connexion à la BDD vérifiée');
    
    app.listen(process.env.PORT || 3000, () => {
      console.log(`🚀 Serveur démarré sur le port ${process.env.PORT || 3000}`);
    });
  } catch (error) {
    console.error('❌ Erreur de connexion à la BDD:', error);
  }
}

startServer();