const pool = require ('../config/bdd');

function getAllPayments() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT payment_date, amount, payment_method FROM payments', (error, results) => {
            if (error) {
                return reject(new Error('Database error'));
            }
            resolve(results);
        });
    });
}


function getPaymentsByMethod(payment_method) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT payment_date, amount FROM payments WHERE payment_method = ?', [payment_method], (error, results) => {
            if (error) {
                return reject(new Error('Database error'));
            }
            resolve(results);
        });
    });
}

function getPaymentsAboveAmount(amount) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT payment_date, amount, payment_method FROM payments WHERE amount > ?', [amount], (error, results) => {
            if (error) {
                return reject(new Error('Database error'));
            }
            resolve(results);
        });
    });
}

function getPaymentsByReservationStatus(reservation_status) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT payment_date, amount, payment_method FROM payments INNER JOIN pay ON pay.id_payment = payments.id_payment INNER JOIN reservations ON reservations.id_reservation = pay.id_reservation WHERE reservation_status = ?', [reservation_status], (error, results) => {
            if (error) {
                return reject(new Error('Database error'));
            }
            resolve(results);
        });
    });
}

function getTotalPaymentsByMonthAndYear(month, year) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT SUM(amount) AS total FROM payments WHERE MONTH(payment_date) = ? AND YEAR(payment_date) = ?', [month, year], (error, results) => {
            if (error) {
                return reject(new Error('Database error'));
            }
            resolve(results);
        });
    });
}

function getTotalPaymentsByReservationStatus(reservation_status) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT SUM(amount) AS total FROM payments INNER JOIN pay ON pay.id_payment = payments.id_payment INNER JOIN reservations ON reservations.id_reservation = pay.id_reservation WHERE reservation_status = ?', [reservation_status], (error, results) => {
            if (error) {
                return reject(new Error('Database error'));
            }
            resolve(results);
        });
    });
}

function createPayment(paymentData) {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO payments (payment_date, amount, payment_method) VALUES (?, ?, ?) RETURNING *', [paymentData.payment_date, paymentData.amount, paymentData.payment_method], (error, results) => {
            if (error) {
                return reject(new Error('Database error'));
            }
            resolve(results[0]);
        });
    });
}

function getPaymentById(id) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT payment_date, amount, payment_method FROM payments WHERE id = ?', [id], (error, results) => {
            if (error) {
                return reject(new Error('Database error'));
            }
            if (results.length === 0) {
                return resolve(null);
            }
            resolve(results[0]);
        });
    });
}

function updatePayment(id, paymentData) {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE payments SET payment_date = ?, amount = ?, payment_method = ? WHERE id = ? RETURNING *',
            [paymentData.payment_date, paymentData.amount, paymentData.payment_method, id], (error, results) => {
                if (error) {
                    return reject(new Error('Database error'));
                }
                if (results.length === 0) {
                    return resolve(null);
                }
                resolve(results[0]);
            });
    });
}

function deletePayment(id) {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM payments WHERE id = ? RETURNING *', [id], (error, results) => {
            if (error) {
                return reject(new Error('Database error'));
            }
            if (results.length === 0) {
                return resolve(null);
            }
            resolve(results[0]);
        });
    });
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
