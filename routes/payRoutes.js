const express = require('express');
const router = express.Router();
const payController = require('../controllers/payController');
const authController = require('../controllers/authController');

// /pay
router.get('/', authController.verifyToken, payController.getAll);

// POST /pay
router.post('/', authController.verifyToken, payController.createPayment);

// PATCH /pay/:id
router.patch('/:id', authController.verifyToken, payController.updatePayment);

// DELETE /pay/:id
router.delete('/:id', authController.verifyToken, payController.deletePayment);

module.exports = router;