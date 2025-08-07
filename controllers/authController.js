const bcrypt = require('bcryptjs');
const authService = require('../services/authService');
const jwt = require('jsonwebtoken');

async function register(req, res) {
    try {
        console.log('🔍 === DEBUG REGISTER ===');
        console.log('Body content:', req.body);
        console.log('Body keys:', req.body ? Object.keys(req.body) : 'No keys');
        
        if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) {
            return res.status(400).json({ 
                message: 'Aucune donnée reçue',
                debug: {
                    bodyType: typeof req.body,
                    bodyContent: req.body,
                    contentType: req.headers['content-type']
                }
            });
        }
        
        // ✅ CORRECTION : Gérer les deux formats (frontend et backend)
        const { 
            email, 
            password, 
            first_name, 
            last_name, 
            firstName,    // ← Du frontend
            lastName,     // ← Du frontend
        } = req.body;
        
        // Utiliser firstName/lastName du frontend OU first_name/last_name
        const finalFirstName = first_name || firstName;
        const finalLastName = last_name || lastName;
        
        console.log('Données extraites:', { 
            email, 
            password: !!password, 
            finalFirstName, 
            finalLastName, 
        });
        
        if (!email || !password || !finalFirstName || !finalLastName) {
            return res.status(400).json({ 
                message: 'Email, mot de passe, prénom et nom sont requis',
                received: { 
                    email: !!email, 
                    password: !!password, 
                    firstName: !!finalFirstName, 
                    lastName: !!finalLastName 
                }
            });
        }
        
        const userData = {
            email,
            password,
            first_name: finalFirstName,  // ✅ Convertir vers le format DB
            last_name: finalLastName,    // ✅ Convertir vers le format DB
            role: 'user'
        };
        
        console.log('🚀 Envoi vers service:', userData);
        
        const newUser = await authService.register(userData);
        
        res.status(201).json({
            message: 'Inscription réussie ! Veuillez vous connecter.',
            user: newUser
        });
    } catch (error) {
        console.error('❌ Erreur controller register:', error.message);
        if (error.message.includes('existe déjà')) {
            return res.status(409).json({ message: 'Cet email existe déjà' });
        }
        res.status(500).json({ message: error.message });
    }
}

async function login(req, res) {
    try {
        console.log('🔍 === DEBUG LOGIN ===');
        console.log('Login body:', req.body);
        
        if (!req.body || !req.body.email || !req.body.password) {
            return res.status(400).json({ 
                message: 'Email et mot de passe requis',
                received: req.body
            });
        }
        
        const user = await authService.login(req.body);
        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const passwordIsValid = await bcrypt.compare(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }
        
        res.status(200).json({ 
            message: 'Connexion réussie',
            token: generateToken(user),
            user: {
                id: user.id_customer,
                email: user.email,
                firstName: user.first_name,  // ✅ Retourner au format frontend
                lastName: user.last_name,    // ✅ Retourner au format frontend
                role: user.role
            }
        });
    } catch (error) {
        console.error('❌ Erreur login:', error);
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
    }, process.env.JWT_SECRET || 'fallback-secret', {
        expiresIn: '24h'
    });
}

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(403).json({ message: 'Aucun token fourni' });
    }
    
    jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token invalide' });
        }
        req.user = decoded;
        next();
    });
}

module.exports = {
    login,
    generateToken,
    register,
    verifyToken 
};