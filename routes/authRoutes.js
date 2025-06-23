const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /auth/login
router.post('/login', (req, res) => {
    authController.login(req, res);
});

// POST /auth/register
router.post('/register', (req, res) => {
    authController.register(req, res);
});

module.exports = router;