const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');
const authController = require('../controllers/authController');

// /services
router.get('/', (req, res) => { servicesController.getAllServices(req, res) });

// /services/available
router.get('/available', (req, res) => { servicesController.getAvailableServices(req, res) });

// /services/above/:price
router.get('/above/:price', (req, res) => { servicesController.getServicesAbovePrice(req, res) });

// /services/room/:room_name
router.get('/room/:room_name', (req, res) => { servicesController.getServicesByRoomName(req, res) });

// /services/less_costly
router.get('/less_costly', (req, res) => { servicesController.getServicesBelowPrice(req, res) });

// /services/:id
router.get('/:id', (req, res) => { servicesController.getServiceById(req, res) });

// POST /services
router.post('/', authController.verifyToken, (req, res) => { servicesController.createService(req, res) });

// PATCH /services/:id
router.patch('/:id', authController.verifyToken, (req, res) => { servicesController.updateService(req, res) });

// DELETE /services/:id
router.delete('/:id', authController.verifyToken, (req, res) => { servicesController.deleteService(req, res) });

module.exports = router;

