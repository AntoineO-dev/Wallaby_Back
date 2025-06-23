const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentsController');
const authController = require('../controllers/authController');

// /payments
router.get('/',(req, res) => {paymentsController.getAllPayments(req, res)});


// /payments/:payment_method
router.get('/method/:payment_method', (req, res) => {paymentsController.getPaymentsByMethod(req, res)});

// /payments/above/:amount
router.get('/above/:amount', (req, res) => {paymentsController.getPaymentsAboveAmount(req, res)});

// /payments/reservation/:reservation_status
router.get('/reservation/:reservation_status',(req, res) => {paymentsController.getPaymentsByReservationStatus(req, res)});

// /payments/total/month/:month/year/:year
router.get('/total/month/:month/year/:year', (req, res) => {paymentsController.getTotalPaymentsByMonthAndYear(req, res)});

// /payments/total/reservation/:reservation_status
router.get('/total/reservation/:reservation_status', (req, res) => {paymentsController.getTotalPaymentsByReservationStatus(req, res)});

// /payments/:id
router.get('/:id', (req, res) => {paymentsController.getPaymentById(req, res)});

// POST /payments
router.post('/', authController.verifyToken, (req, res) => {paymentsController.createPayment(req, res)});

// PATCH /payments/:id
router.patch('/:id', authController.verifyToken, (req, res) => {paymentsController.updatePayment(req, res)});

// DELETE /payments/:id
router.delete('/:id', authController.verifyToken, (req, res) => {paymentsController.deletePayment(req, res)});

module.exports = router;