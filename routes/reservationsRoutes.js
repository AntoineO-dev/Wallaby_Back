const express = require('express');
const router = express.Router();
const reservationsController = require('../controllers/reservationsController');

// Route pour récupérer toutes les réservations
router.get('/', reservationsController.getAllReservations);






// Route pour récupérer une réservation par son ID
router.get('/:id', reservationsController.getReservationById);

module.exports = router;