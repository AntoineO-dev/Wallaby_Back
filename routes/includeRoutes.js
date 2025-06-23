const express = require('express');
const router = express.Router();
const includeController = require('../controllers/includeController');
const authController = require('../controllers/authController');

// /include
router.get('/', (req, res) => { includeController.getAllInclude(req, res) });

// /include/reservations/:id_reservation
router.get('/reservations/:id_reservation', (req, res) => { includeController.getIncludeByReservationId(req, res) });

// /include/total_services/:id_reservation
router.get('/total_services/:id_reservation', (req, res) => { includeController.getTotalServicesByReservationId(req, res) });

// /include/rooms/:room_name
router.get('/rooms/:room_name', (req, res) => { includeController.getIncludeByRoomName(req, res) });

// /include/:id
router.get('/:id', (req, res) => { includeController.getIncludeById(req, res) });

// POST /include
router.post('/', authController.verifyToken, (req, res) => { includeController.createInclude(req, res) });

// PATCH /include/:id
router.patch('/:id', authController.verifyToken, (req, res) => { includeController.updateInclude(req, res) });

// DELETE /include/:id
router.delete('/:id', authController.verifyToken, (req, res) => { includeController.deleteInclude(req, res) });

module.exports = router;