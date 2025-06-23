const express = require('express');
const router = express.Router();
const roomsController = require('../controllers/roomsController');
const authController = require('../controllers/authController');

// /rooms
router.get('/', roomsController.getAllRooms);

// /rooms/available
router.get('/available', roomsController.getAvailableRooms);

// /rooms/pricesAbove/:price_per_night
router.get('/pricesAbove/:price_per_night', roomsController.getRoomsAbovePrice);

// /rooms/pricesBelow/:price_per_night
router.get('/pricesBelow/:price_per_night', roomsController.getRoomsBelowPrice);

// /rooms/name/:room_name
router.get('/name/:room_name', roomsController.getRoomByName);

// /rooms/capacity/:capacity
router.get('/capacity/:capacity', roomsController.getRoomsByCapacity);

// /rooms/:id
router.get('/:id', roomsController.getRoomById);

// POST /rooms
router.post('/', authController.verifyToken, (req, res) => {roomsController.createRoom(req, res)});

// PATCH /rooms/:id
router.patch('/:id', authController.verifyToken, (req, res) => {roomsController.updateRoom(req, res)});

// DELETE /rooms/:id
router.delete('/:id', authController.verifyToken, (req, res) => {roomsController.deleteRoom(req, res)});

module.exports = router;