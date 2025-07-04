const customerService = require('../services/customerService');

async function getAllCustomers(req, res) {
    try {
        const customers = await customerService.getAllCustomers();
        res.status(200).json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function getCustomersByRegistrationDate(req, res) {
    const registrationDate = req.params.registration_date;
    try {
        const customers = await customerService.getCustomersByRegistrationDate(registrationDate);
        if (customers.length > 0) {
            res.status(200).json(customers);
        } else {
            res.status(404).json({ message: 'No customers found for this registration date' });
        }
    } catch (error) {
        console.error('Error fetching customers by registration date:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function getCustomersByTotalCost(req, res) {
    const totalCost = req.params.total_cost;
    try {
        const customers = await customerService.getCustomersByTotalCost(totalCost);
        if (customers.length > 0) {
            res.status(200).json(customers);
        } else {
            res.status(404).json({ message: 'No customers found with this total cost' });
        }
    } catch (error) {
        console.error('Error fetching customers by total cost:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function getCustomersByRoomName(req, res) {
    const roomName = req.params.room_name;
    try {
        const customers = await customerService.getCustomersByRoomName(roomName);
        if (customers.length > 0) {
            res.status(200).json(customers);
        } else {
            res.status(404).json({ message: 'No customers found for this room name' });
        }
    } catch (error) {
        console.error('Error fetching customers by room name:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function getCustomerById(req, res) {
    const customerId = req.params.id;
    try {
        const customer = await customerService.getCustomerById(customerId);
        if (customer) {
            res.status(200).json(customer);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        console.error('Error fetching customer by ID:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function createCustomer(req, res) {
    try {
        const newCustomer = await customerService.createCustomer(req.body);
        res.status(201).json(newCustomer);
    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function updateCustomer(req, res) {
    const customerId = req.params.id;
    try {
        const updatedCustomer = await customerService.updateCustomer(customerId, req.body);
        if (updatedCustomer) {
            res.status(200).json(updatedCustomer);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function deleteCustomer(req, res) {
    const customerId = req.params.id;
    try {
        const result = await customerService.deleteCustomer(customerId);
        if (result.affectedRows > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {
    getAllCustomers,
    getCustomerById,
    getCustomersByRegistrationDate,
    getCustomersByTotalCost,
    getCustomersByRoomName,
    createCustomer,
    updateCustomer,
    deleteCustomer
};