const pool = require('../config/bdd');

function getAll () {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM payments', (error, results) => {
            if (error) {
                console.error('Error fetching all payments:', error);
                return reject(error);
            }
            resolve(results.rows);
        });
    });
}

function createPayment (paymentData) {
    return new Promise((resolve, reject) => {
        const { id_payment, amount, payment_method } = paymentData;
        pool.query('INSERT INTO payments (id_payment, amount, payment_method) VALUES (?, ?, ?) RETURNING *', [id_payment, amount, payment_method], (error, results) => {
            if (error) {
                console.error('Error creating payment:', error);
                return reject(error);
            }
            resolve(results.rows[0]);
        });
    });
}

function updatePayment (paymentId, updatedData) {
    return new Promise((resolve, reject) => {
        const { amount, payment_method } = updatedData;
        pool.query('UPDATE payments SET amount = ?, payment_method = ? WHERE id_payment = ? RETURNING *', [amount, payment_method, paymentId], (error, results) => {
            if (error) {
                console.error('Error updating payment:', error);
                return reject(error);
            }
            if (results.rows.length === 0) {
                return resolve(null); // No payment found
            }
            resolve(results.rows[0]);
        });
    });
}

function deletePayment (paymentId) {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM payments WHERE id_payment = $1', [paymentId], (error, results) => {
            if (error) {
                console.error('Error deleting payment:', error);
                return reject(error);
            }
            resolve(results.rowCount > 0);
        });
    });
}

module.exports = {
    getAll,
    createPayment,
    updatePayment,
    deletePayment
};