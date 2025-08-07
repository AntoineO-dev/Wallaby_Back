const bcrypt = require('bcryptjs');
const authService = require('../services/authService');
const jwt = require('jsonwebtoken');

async function register(req, res) {
    try {
        console.log('🔍 === DEBUG REGISTER ===');
        console.log('Body content:', req.body);
        
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
        
        const { 
            email, 
            password, 
            first_name, 
            last_name, 
            firstName,
            lastName,
        } = req.body;
        
        const finalFirstName = first_name || firstName;
        const finalLastName = last_name || lastName;
        
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
            first_name: finalFirstName,
            last_name: finalLastName
        };
        
        console.log('🚀 Envoi vers service:', userData);
        
        const newUser = await authService.register(userData);
        
        // ✅ RÉPONSE MODIFIÉE : Sans token, avec indication de redirection
        res.status(201).json({
            success: true,
            message: 'Inscription réussie ! Vous pouvez maintenant vous connecter avec vos identifiants.',
            redirectTo: '/login', // ✅ Indication pour le frontend
            user: {
                id: newUser.id_customer,
                email: newUser.email,
                firstName: newUser.first_name,
                lastName: newUser.last_name
            }
        });
    } catch (error) {
        console.error('❌ Erreur controller register:', error.message);
        if (error.message.includes('existe déjà')) {
            return res.status(409).json({ 
                success: false,
                message: 'Cet email existe déjà'
            });
        }
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
}

async function login(req, res) {
    try {
        console.log('🔍 === DEBUG LOGIN ===');
        console.log('Login body:', req.body);
        
        if (!req.body || !req.body.email || !req.body.password) {
            return res.status(400).json({ 
                success: false,
                message: 'Email et mot de passe requis',
                received: req.body
            });
        }
        
        const user = await authService.login(req.body);
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Email ou mot de passe incorrect' 
            });
        }

        const passwordIsValid = await bcrypt.compare(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ 
                success: false,
                message: 'Email ou mot de passe incorrect' 
            });
        }
        
        res.status(200).json({ 
            success: true,
            message: 'Connexion réussie',
            token: generateToken(user),
            user: {
                id: user.id_customer,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name
            }
        });
    } catch (error) {
        console.error('❌ Erreur login:', error);
        res.status(500).json({ 
            success: false,
            message: 'Erreur lors de la connexion', 
            error: error.message 
        });
    }
}

function generateToken(user) {
    return jwt.sign({
        id: user.id_customer,
        email: user.email,
        nom: user.last_name,
        prenom: user.first_name
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