const pool = require('../config/bdd');

async function getAllCustomers() {
    try {
        const [results] = await pool.query('SELECT * FROM customers');
        return results;
    } catch (error) {
        console.error('Error fetching all customers:', error);
        throw error;
    }
}

async function getCustomerById(customerId) {
    try {
        const [results] = await pool.query('SELECT * FROM customers WHERE id_customer = ?', [customerId]);
        if (results.length === 0) {
            return null;
        }
        return results[0];
    } catch (error) {
        console.error('Error fetching customer by ID:', error);
        throw error;
    }
}

async function getCustomerByEmail(email) {
    try {
        const [results] = await pool.query('SELECT * FROM customers WHERE email = ?', [email]);
        if (results.length === 0) {
            return null;
        }
        return results[0];
    } catch (error) {
        console.error('Error fetching customer by email:', error);
        throw error;
    }
}

async function getCustomerByName(first_name, last_name) {
    try {
        const [results] = await pool.query('SELECT * FROM customers WHERE first_name = ? AND last_name = ?', [first_name, last_name]);
        return results;
    } catch (error) {
        console.error('Error fetching customer by name:', error);
        throw error;
    }
}

async function getCustomerReservations(customerId) {
    try {
        const [results] = await pool.query(
            `SELECT r.id_reservation, r.check_in_date, r.check_out_date, r.total_cost, r.reservation_status,
                    rm.room_name, rm.price_per_night
             FROM reservations r
             JOIN rooms rm ON r.id_room = rm.id_room
             WHERE r.id_customer = ?`, 
            [customerId]
        );
        return results;
    } catch (error) {
        console.error('Error fetching customer reservations:', error);
        throw error;
    }
}

async function createCustomer(customerData) {
    try {
        const { email, password, first_name, last_name, phone_number, role } = customerData;
        const [result] = await pool.query(
            'INSERT INTO customers (email, password, first_name, last_name, phone_number, role) VALUES (?, ?, ?, ?, ?, ?)',
            [email, password, first_name, last_name, phone_number, role]
        );
        return result.insertId;
    } catch (error) {
        console.error('Error creating customer:', error);
        throw error;
    }
}

async function updateCustomer(customerId, customerData) {
    try {
        const { email, password, first_name, last_name, phone_number, role } = customerData;
        
        // Construire dynamiquement la requête en fonction des champs fournis
        let updateFields = [];
        let updateValues = [];
        
        if (email) {
            updateFields.push('email = ?');
            updateValues.push(email);
        }
        if (password) {
            updateFields.push('password = ?');
            updateValues.push(password);
        }
        if (first_name) {
            updateFields.push('first_name = ?');
            updateValues.push(first_name);
        }
        if (last_name) {
            updateFields.push('last_name = ?');
            updateValues.push(last_name);
        }
        if (phone_number) {
            updateFields.push('phone_number = ?');
            updateValues.push(phone_number);
        }
        if (role) {
            updateFields.push('role = ?');
            updateValues.push(role);
        }
        
        // Si aucun champ à mettre à jour, retourner false
        if (updateFields.length === 0) {
            return false;
        }
        
        // Ajouter l'ID du client aux valeurs pour la clause WHERE
        updateValues.push(customerId);
        
        const [result] = await pool.query(
            `UPDATE customers SET ${updateFields.join(', ')} WHERE id_customer = ?`,
            updateValues
        );
        
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error updating customer:', error);
        throw error;
    }
}

async function deleteCustomer(customerId) {
    try {
        const [result] = await pool.query('DELETE FROM customers WHERE id_customer = ?', [customerId]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error deleting customer:', error);
        throw error;
    }
}

async function getCustomersByRole(role) {
    try {
        const [results] = await pool.query('SELECT * FROM customers WHERE role = ?', [role]);
        return results;
    } catch (error) {
        console.error('Error fetching customers by role:', error);
        throw error;
    }
}

async function getCustomerCount() {
    try {
        const [results] = await pool.query('SELECT COUNT(*) as total FROM customers');
        return results[0].total;
    } catch (error) {
        console.error('Error counting customers:', error);
        throw error;
    }
}

async function searchCustomers(searchTerm) {
    try {
        const [results] = await pool.query(
            `SELECT * FROM customers 
             WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ?`,
            [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
        );
        return results;
    } catch (error) {
        console.error('Error searching customers:', error);
        throw error;
    }
}

module.exports = {
    getAllCustomers,
    getCustomerById,
    getCustomerByEmail,
    getCustomerByName,
    getCustomerReservations,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomersByRole,
    getCustomerCount,
    searchCustomers
};