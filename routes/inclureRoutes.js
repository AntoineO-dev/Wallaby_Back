const express = require('express');
const router = express.Router();
const inclureController = require('../controllers/inclureController');
const authController = require('../controllers/authController');

// /inclure
router.get('/', (req, res) => { inclureController.getAllInclure(req, res) });

// /include/reservations/:id_reservation
router.get('/reservations/:id_reservation', (req, res) => { inclureController.getInclureByReservationId(req, res) });

// /include/total_services/:id_reservation
router.get('/total_services/:id_reservation', (req, res) => { inclureController.getTotalServicesByReservationId(req, res) });

// /include/rooms/:room_name
router.get('/rooms/:room_name', (req, res) => { inclureController.getInclureByRoomName(req, res) });

// /include/:id
router.get('/:id', (req, res) => { inclureController.getInclureById(req, res) });

// POST /include
router.post('/', authController.verifyToken, (req, res) => { inclureController.createInclure(req, res) });

// PATCH /include/:id
router.patch('/:id', authController.verifyToken, (req, res) => { inclureController.updateInclure(req, res) });

// DELETE /include/:id
router.delete('/:id', authController.verifyToken, (req, res) => { inclureController.deleteInclure(req, res) });