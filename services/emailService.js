const nodemailer = require('nodemailer');
const crypto = require('crypto');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // votre email
        pass: process.env.EMAIL_PASS  // votre mot de passe app
    }
});

// Générer un token de confirmation
function generateConfirmationToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Envoyer email de confirmation
async function sendConfirmationEmail(email, firstName, confirmationToken) {
    const confirmationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/confirm-email?token=${confirmationToken}`;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Confirmez votre adresse email - AirBnB',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #FF5A5F;">Bienvenue ${firstName} !</h2>
                <p>Merci de vous être inscrit sur notre plateforme AirBnB.</p>
                <p>Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${confirmationUrl}" 
                       style="background-color: #FF5A5F; color: white; padding: 12px 30px; 
                              text-decoration: none; border-radius: 5px; display: inline-block;">
                        Confirmer mon email
                    </a>
                </div>
                <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
                <p style="word-break: break-all; color: #666;">${confirmationUrl}</p>
                <p><small>Ce lien expire dans 24 heures.</small></p>
            </div>
        `
    };
    
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('📧 Email envoyé:', info.messageId);
        return true;
    } catch (error) {
        console.error('❌ Erreur envoi email:', error);
        throw error;
    }
}

// ✅ FONCTION DE TEST pour vérifier la configuration
async function testEmailConfiguration() {
    try {
        await transporter.verify();
        console.log('✅ Configuration email valide');
        return true;
    } catch (error) {
        console.error('❌ Configuration email invalide:', error.message);
        return false;
    }
}

module.exports = {
    generateConfirmationToken,
    sendConfirmationEmail,
    testEmailConfiguration
};