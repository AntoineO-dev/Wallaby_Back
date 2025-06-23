const payService = require('../services/payService');

async function getAll(req, res) {
    try {
        const payments = await payService.getAllPayments();
        res.status(200).json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function createPayment(req, res) {
    try {
        const paymentData = req.body;
        const newPayment = await payService.createPayment(paymentData);
        res.status(201).json(newPayment);
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function updatePayment(req, res) {
    try {
        const paymentId = req.params.id;
        const updatedData = req.body;
        const updatedPayment = await payService.updatePayment(paymentId, updatedData);
        if (updatedPayment) {
            res.status(200).json(updatedPayment);
        } else {
            res.status(404).json({ message: 'Payment not found' });
        }
    } catch (error) {
        console.error('Error updating payment:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function deletePayment(req, res) {
    try {
        const paymentId = req.params.id;
        const deleted = await payService.deletePayment(paymentId);
        if (deleted) {
            res.status(204).send(); // No content
        } else {
            res.status(404).json({ message: 'Payment not found' });
        }
    } catch (error) {
        console.error('Error deleting payment:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {
    getAll,
    createPayment,
    updatePayment,
    deletePayment
};