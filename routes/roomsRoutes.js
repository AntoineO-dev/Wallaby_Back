const express = require('express');
const router = express.Router();
const roomsController = require('../controllers/roomsController');

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



module.exports = router;