const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const authController = require('../controllers/authController');

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

// POST /customers
router.post('/', authController.verifyToken, (req, res) => {customerController.createCustomer(req, res)});

// /PATCH /customers/:id
router.patch('/:id', authController.verifyToken, (req, res) => {customerController.updateCustomer(req, res)});

// DELETE /customers/:id
router.delete('/:id', authController.verifyToken, (req, res) => {customerController.deleteCustomer(req, res)});

module.exports = router;