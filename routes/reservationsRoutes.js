const express = require('express');
const router = express.Router();
const reservationsController = require('../controllers/reservationsController');

// /reservations
router.get('/', reservationsController.getAllReservations);

// /reservations/status/:reservation_status
router.get('/status/:reservation_status', reservationsController.getAllReservations);

// /reservations/average_cost
router.get('/average_cost', reservationsController.getAllReservationsByStatus);

// /reservations/above/total_cost/:total_cost
router.get('/above/total_cost/:total_cost', reservationsController.getAverageCost);

// /reservations/below/total_cost/:total_cost
router.get('/below/total_cost/:total_cost', reservationsController.getAboveTotalCost);

// /reservations/rooms/:room_name
router.get('/rooms/:room_name', reservationsController.getAboveTotalCost);





// /reservations/:id
router.get('/:id', reservationsController.getReservationById);

module.exports = router;