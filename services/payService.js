const pool = require('../config/bdd');

async function getAll() {
    try {
        const [results] = await pool.query('SELECT * FROM payments');
        return results;
    } catch (error) {
        console.error('Error fetching all payments:', error);
        throw error;
    }
}

async function createPayment(paymentData) {
    try {
        const { id_payment, amount, payment_method } = paymentData;
        const [result] = await pool.query(
            'INSERT INTO payments (id_payment, amount, payment_method) VALUES (?, ?, ?)', 
            [id_payment, amount, payment_method]
        );
        
        if (result.insertId) {
            const [newPayment] = await pool.query('SELECT * FROM payments WHERE id_payment = ?', [result.insertId]);
            return newPayment[0];
        }
        return null;
    } catch (error) {
        console.error('Error creating payment:', error);
        throw error;
    }
}

async function updatePayment(paymentId, updatedData) {
    try {
        const { amount, payment_method } = updatedData;
        const [result] = await pool.query(
            'UPDATE payments SET amount = ?, payment_method = ? WHERE id_payment = ?', 
            [amount, payment_method, paymentId]
        );
        
        if (result.affectedRows === 0) {
            return null; // No payment found
        }
        
        const [updatedPayment] = await pool.query('SELECT * FROM payments WHERE id_payment = ?', [paymentId]);
        return updatedPayment[0];
    } catch (error) {
        console.error('Error updating payment:', error);
        throw error;
    }
}

async function deletePayment(paymentId) {
    try {
        const [result] = await pool.query(
            'DELETE FROM payments WHERE id_payment = ?', 
            [paymentId]
        );
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error deleting payment:', error);
        throw error;
    }
}

module.exports = {
    getAll,
    createPayment,
    updatePayment,
    deletePayment
};