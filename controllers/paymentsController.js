const paymentsService = require('../services/paymentsService');

async function getAllPayments(req, res) {
    try {
        const payments = await paymentsService.getAllPayments();
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving payments', error: error.message });
    }
}


async function getPaymentsByMethod(req, res) {
    const { payment_method } = req.params;
    try {
        const payments = await paymentsService.getPaymentsByMethod(payment_method);
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving payments', error: error.message });
    }
}

async function getPaymentsAboveAmount(req, res) {
    const { amount } = req.params;
    try {
        const payments = await paymentsService.getPaymentsAboveAmount(amount);
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving payments', error: error.message });
    }
}

async function getPaymentsByReservationStatus(req, res) {
    const { reservation_status } = req.params;
    try {
        const payments = await paymentsService.getPaymentsByReservationStatus(reservation_status);
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving payments', error: error.message });
    }
}

async function getTotalPaymentsByMonthAndYear(req, res) {
    const { month, year } = req.params;
    try {
        const total = await paymentsService.getTotalPaymentsByMonthAndYear(month, year);
        res.status(200).json(total);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving total payments', error: error.message });
    }
}

async function getTotalPaymentsByReservationStatus(req, res) {
    const { reservation_status } = req.params;
    try {
        const total = await paymentsService.getTotalPaymentsByReservationStatus(reservation_status);
        res.status(200).json(total);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving total payments by reservation status', error: error.message });
    }
}

async function getPaymentById(req, res) {
    const { id } = req.params;
    try {
        const payment = await paymentsService.getPaymentById(id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving payment', error: error.message });
    }
}

async function createPayment(req, res) {
    try {
        const payment = await paymentsService.createPayment(req.body);
        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating payment', error: error.message });
    }
}

async function updatePayment(req, res) {
    const { id } = req.params;
    try {
        const updatedPayment = await paymentsService.updatePayment(id, req.body);
        if (!updatedPayment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(updatedPayment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating payment', error: error.message });
    }
}

async function deletePayment(req, res) {
    const { id } = req.params;
    try {
        const result = await paymentsService.deletePayment(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting payment', error: error.message });
    }
}

module.exports = {
    getAllPayments,
    getPaymentById,
    getPaymentsByMethod,
    getPaymentsAboveAmount,
    getPaymentsByReservationStatus,
    getTotalPaymentsByMonthAndYear,
    getTotalPaymentsByReservationStatus,
    createPayment,
    updatePayment,
    deletePayment
};
