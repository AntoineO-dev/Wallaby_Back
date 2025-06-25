const express = require('express');
const router = express.Router();
const reservationsController = require('../controllers/reservationsController');
const authController = require('../controllers/authController');

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

// Route pour vérifier la disponibilité d'une chambre
router.get('/check-availability', authController.verifyToken, (req, res) => { reservationsController.checkAvailability(req, res); });
// /POST /reservations
router.post('/', authController.verifyToken, (req, res) => {reservationsController.createReservation(req, res)});

// /PATCH /reservations/:id
router.patch('/:id', authController.verifyToken, (req, res) => {reservationsController.updateReservation(req, res)});

// DELETE /reservations/:id
router.delete('/:id', authController.verifyToken, (req, res) => {reservationsController.deleteReservation(req, res)});

// Route de confirmation de réservation
router.post('/:id/confirm', authController.verifyToken, (req, res) => {reservationsController.confirmReservation(req, res);});


module.exports = router;