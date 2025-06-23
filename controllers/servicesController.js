const servicesService = require('../services/servicesService');

async function getAllServices(req, res) {
    try {
        const services = await servicesService.getAllServices();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving services', error });
    }
}

async function getAvailableServices(req, res) {
    try {
        const services = await servicesService.getAvailableServices();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving available services', error });
    }
}

async function getServicesAbovePrice(req, res) {
    const price = parseFloat(req.params.price);
    if (isNaN(price)) {
        return res.status(400).json({ message: 'Invalid price parameter' });
    }
    try {
        const services = await servicesService.getServicesAbovePrice(price);
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving services above price', error });
    }
}   

async function getServicesByRoomName(req, res) {
    const roomName = req.params.room_name;
    if (!roomName) {
        return res.status(400).json({ message: 'Room name parameter is required' });
    }
    try {
        const services = await servicesService.getServicesByRoomName(roomName);
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving services by room name', error });
    }
}

async function getServicesBelowPrice(req, res) {
    try {
        const services = await servicesService.getServicesBelowPrice();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving less costly services', error });
    }
}

async function getServiceById(req, res) {
    const serviceId = req.params.id;
    if (!serviceId) {
        return res.status(400).json({ message: 'Service ID parameter is required' });
    }
    try {
        const service = await servicesService.getServiceById(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving service by ID', error });
    }
}

async function createService(req, res) {
    const serviceData = req.body;
    if (!serviceData || !serviceData.name || !serviceData.price) {
        return res.status(400).json({ message: 'Service name and price are required' });
    }
    try {
        const newService = await servicesService.createService(serviceData);
        res.status(201).json(newService);
    } catch (error) {
        res.status(500).json({ message: 'Error creating service', error });
    }
}

async function updateService(req, res) {
    const serviceId = req.params.id;
    const serviceData = req.body;
    if (!serviceId || !serviceData) {
        return res.status(400).json({ message: 'Service ID and data are required' });
    }
    try {
        const updatedService = await servicesService.updateService(serviceId, serviceData);
        if (!updatedService) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json(updatedService);
    } catch (error) {
        res.status(500).json({ message: 'Error updating service', error });
    }
}

async function deleteService(req, res) {
    const serviceId = req.params.id;
    if (!serviceId) {
        return res.status(400).json({ message: 'Service ID parameter is required' });
    }
    try {
        const deletedService = await servicesService.deleteService(serviceId);
        if (!deletedService) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting service', error });
    }
}

module.exports = {
    getAllServices,
    getAvailableServices,
    getServicesAbovePrice,
    getServicesByRoomName,
    getServicesBelowPrice,
    getServiceById,
    createService,
    updateService,
    deleteService
};