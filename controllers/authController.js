const authService = require('../services/authService');

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await authService.login(email, password);
        res.json({ token });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

const register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await authService.register(email, password);
        res.status(201).json({ user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    login,
    register
};
