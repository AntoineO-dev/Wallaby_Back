const bcrypt = require('bcryptjs');
const authService = require('../services/authService');
const jwt = require('jsonwebtoken');

async function login(req, res) {
    try{
        const user = await authService.login(req.body);
        if (!user) {
            return res.status(401).json({ message: 'Email ou Mot de passe incorrect' });
        }

        const passwordisValid = await bcrypt.compareSync(req.body.password, user.password);
        if (!passwordisValid) {
            return res.status(401).json({ accessToken: null, message: 'Email ou Mot de passe incorrect' });
        }
        res.status(200).json({token:generateToken(user)});
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
    }
}

function generateToken(user) {
    return jwt.sign({
        id: user.id_customer,
        email: user.email,
        nom: user.last_name,
        prenom: user.first_name,
        role: user.role
    }, process.env.JWT_SECRET, {
        expiresIn: '24h'
    });
}

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: 'Aucun token fourni' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token invalide' });
        }
        req.user = decoded;
        next();
    });
}

function register(req, res) {
    try {
        const user = authService.register(req.body);
        res.status(201).json({ message: 'Utilisateur créé avec succès', user });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement', error: error.message });
    }
}

module.exports = {
    login,
    generateToken,
    register,
    verifyToken 
};
