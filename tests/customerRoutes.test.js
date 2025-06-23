const request = require('supertest');
const express = require('express');
const customerRoutes = require('../routes/customerRoutes');
const customerController = require('../controllers/customerController');

// Mock du controller pour éviter les appels à la base de données
jest.mock('../controllers/customerController');

// Créer une application Express pour les tests
const app = express();
app.use(express.json());
app.use('/api/customers', customerRoutes);

describe('Customer Routes', () => {
  beforeEach(() => {
    // Réinitialiser les mocks entre chaque test
    jest.clearAllMocks();
  });

  test('GET /api/customers should return all customers', async () => {
    // Mock de la réponse du controller
    const mockCustomers = [
      { id_customer: 1, first_name: 'John', last_name: 'Doe' },
      { id_customer: 2, first_name: 'Jane', last_name: 'Smith' }
    ];
    
    customerController.getAllCustomers.mockImplementation((req, res) => {
      res.status(200).json(mockCustomers);
    });

    // Tester la route
    const response = await request(app).get('/api/customers');
    
    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCustomers);
    expect(customerController.getAllCustomers).toHaveBeenCalledTimes(1);
  });

  test('GET /api/customers/:id should return a specific customer', async () => {
    const mockCustomer = { id_customer: 1, first_name: 'John', last_name: 'Doe' };
    
    customerController.getCustomerById.mockImplementation((req, res) => {
      res.status(200).json(mockCustomer);
    });

    const response = await request(app).get('/api/customers/1');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCustomer);
    expect(customerController.getCustomerById).toHaveBeenCalledTimes(1);
  });

  test ('GET,/customers/date/:registration_date', async () => {
    const mockCustomers = [
      { id_customer: 1, first_name: 'John', last_name: 'Doe', registration_date: '2023-01-01' },
      { id_customer: 2, first_name: 'Jane', last_name: 'Smith', registration_date: '2023-01-02' }
    ];
    customerController.getCustomersByRegistrationDate.mockImplementation((req, res) => {
      res.status(200).json(mockCustomers);
    });
    const response = await request(app).get('/api/customers/date/2023-01-01');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCustomers);
    expect(customerController.getCustomersByRegistrationDate).toHaveBeenCalledTimes(1);
    });
});

module.exports = {
    getAllCustomers: jest.fn(),
    getCustomerById: jest.fn(),
    createCustomer: jest.fn(),
    updateCustomer: jest.fn(),
    deleteCustomer: jest.fn()
}