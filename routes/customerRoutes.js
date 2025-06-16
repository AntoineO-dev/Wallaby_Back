const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// /customers
router.get('/', customerController.getAllCustomers);

// /customers/date/:registration_date
router.get('/date/:registration_date', customerController.getCustomersByRegistrationDate);

// customers/spent/:total_cost
router.get('/spent/:total_cost', customerController.getCustomersByTotalCost);

// customers/reservations/rooms/:room_name
router.get('/reservations/rooms/:room_name', customerController.getCustomersByRoomName);

// /customers/:id
router.get('/:id', customerController.getCustomerById);

module.exports = router;