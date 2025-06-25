const pool = require('../config/bdd');

async function getAllPayments() {
    try {
        const [results] = await pool.query('SELECT payment_date, amount, payment_method FROM payments');
        return results;
    } catch (error) {
        console.error('Error fetching all payments:', error);
        throw new Error('Database error');
    }
}

async function getPaymentsByMethod(payment_method) {
    try {
        const [results] = await pool.query(
            'SELECT payment_date, amount FROM payments WHERE payment_method = ?', 
            [payment_method]
        );
        return results;
    } catch (error) {
        console.error('Error fetching payments by method:', error);
        throw new Error('Database error');
    }
}

async function getPaymentsAboveAmount(amount) {
    try {
        const [results] = await pool.query(
            'SELECT payment_date, amount, payment_method FROM payments WHERE amount > ?', 
            [amount]
        );
        return results;
    } catch (error) {
        console.error('Error fetching payments above amount:', error);
        throw new Error('Database error');
    }
}

async function getPaymentsByReservationStatus(reservation_status) {
    try {
        const [results] = await pool.query(
            'SELECT payment_date, amount, payment_method FROM payments INNER JOIN pay ON pay.id_payment = payments.id_payment INNER JOIN reservations ON reservations.id_reservation = pay.id_reservation WHERE reservation_status = ?', 
            [reservation_status]
        );
        return results;
    } catch (error) {
        console.error('Error fetching payments by reservation status:', error);
        throw new Error('Database error');
    }
}

async function getTotalPaymentsByMonthAndYear(month, year) {
    try {
        const [results] = await pool.query(
            'SELECT SUM(amount) AS total FROM payments WHERE MONTH(payment_date) = ? AND YEAR(payment_date) = ?', 
            [month, year]
        );
        return results;
    } catch (error) {
        console.error('Error calculating total payments by month and year:', error);
        throw new Error('Database error');
    }
}

async function getTotalPaymentsByReservationStatus(reservation_status) {
    try {
        const [results] = await pool.query(
            'SELECT SUM(amount) AS total FROM payments INNER JOIN pay ON pay.id_payment = payments.id_payment INNER JOIN reservations ON reservations.id_reservation = pay.id_reservation WHERE reservation_status = ?', 
            [reservation_status]
        );
        return results;
    } catch (error) {
        console.error('Error calculating total payments by reservation status:', error);
        throw new Error('Database error');
    }
}

async function createPayment(paymentData) {
    try {
        const [result] = await pool.query(
            'INSERT INTO payments (payment_date, amount, payment_method) VALUES (?, ?, ?)', 
            [paymentData.payment_date, paymentData.amount, paymentData.payment_method]
        );
        
        // MySQL ne supporte pas RETURNING, donc nous devons faire une requête séparée
        if (result.insertId) {
            const [newPayment] = await pool.query('SELECT * FROM payments WHERE id_payment = ?', [result.insertId]);
            return newPayment[0];
        }
        return null;
    } catch (error) {
        console.error('Error creating payment:', error);
        throw new Error('Database error');
    }
}

async function getPaymentById(id) {
    try {
        const [results] = await pool.query(
            'SELECT payment_date, amount, payment_method FROM payments WHERE id_payment = ?', 
            [id]
        );
        
        if (results.length === 0) {
            return null;
        }
        
        return results[0];
    } catch (error) {
        console.error('Error fetching payment by ID:', error);
        throw new Error('Database error');
    }
}

async function updatePayment(id, paymentData) {
    try {
        const [result] = await pool.query(
            'UPDATE payments SET payment_date = ?, amount = ?, payment_method = ? WHERE id_payment = ?',
            [paymentData.payment_date, paymentData.amount, paymentData.payment_method, id]
        );
        
        if (result.affectedRows === 0) {
            return null;
        }
        
        // Récupérer le paiement mis à jour
        const [updatedPayment] = await pool.query('SELECT * FROM payments WHERE id_payment = ?', [id]);
        return updatedPayment[0];
    } catch (error) {
        console.error('Error updating payment:', error);
        throw new Error('Database error');
    }
}

async function deletePayment(id) {
    try {
        // Récupérer le paiement avant de le supprimer
        const [payment] = await pool.query('SELECT * FROM payments WHERE id_payment = ?', [id]);
        
        if (payment.length === 0) {
            return null;
        }
        
        const [result] = await pool.query('DELETE FROM payments WHERE id_payment = ?', [id]);
        
        if (result.affectedRows === 0) {
            return null;
        }
        
        return payment[0];
    } catch (error) {
        console.error('Error deleting payment:', error);
        throw new Error('Database error');
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