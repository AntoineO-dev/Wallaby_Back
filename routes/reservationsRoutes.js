const express = require('express');
const router = express.Router();
const reservationsController = require('../controllers/reservationsController');

// /reservations
router.get('/', reservationsController.getAllReservations);

// /reservations/status/:reservation_status
router.get('/status/:reservation_status', reservationsController.getAllReservations);






// Route pour récupérer une réservation par son ID
router.get('/:id', reservationsController.getReservationById);

module.exports = router;