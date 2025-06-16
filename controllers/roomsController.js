const roomsService = require('../services/roomsService');

async function getAllRooms(req, res) {
    try {
        const rooms = await roomsService.getAllRooms();
        res.status(200).json(rooms);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function getAvailableRooms(req, res) {
    try {
        const availableRooms = await roomsService.getAvailableRooms();
        res.status(200).json(availableRooms);
    } catch (error) {
        console.error('Error fetching available rooms:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function getRoomsAbovePrice(req, res) {
    try {
        const pricePerNight = parseFloat(req.params.price_per_night);
        if (isNaN(pricePerNight)) {
            return res.status(400).json({ message: 'Invalid price parameter' });
        }
        const rooms = await roomsService.getRoomsAbovePrice(pricePerNight);
        res.status(200).json(rooms);
    } catch (error) {
        console.error('Error fetching rooms above price:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function getRoomsBelowPrice(req, res) {
    try {
        const pricePerNight = parseFloat(req.params.price_per_night);
        if (isNaN(pricePerNight)) {
            return res.status(400).json({ message: 'Invalid price parameter' });
        }
        const rooms = await roomsService.getRoomsBelowPrice(pricePerNight);
        res.status(200).json(rooms);
    } catch (error) {
        console.error('Error fetching rooms below price:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function getRoomByName(req, res) {
    try {
        const roomName = req.params.room_name;
        const room = await roomsService.getRoomByName(roomName);
        if (room) {
            res.status(200).json(room);
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        console.error('Error fetching room by name:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function getRoomsByCapacity(req, res) {
    try {
        const capacity = parseInt(req.params.capacity, 10);
        if (isNaN(capacity)) {
            return res.status(400).json({ message: 'Invalid capacity parameter' });
        }
        const rooms = await roomsService.getRoomsByCapacity(capacity);
        res.status(200).json(rooms);
    } catch (error) {
        console.error('Error fetching rooms by capacity:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function getRoomById(req, res) {
    try {
        const roomId = req.params.id;
        const room = await roomsService.getRoomById(roomId);
        if (room) {
            res.status(200).json(room);
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        console.error('Error fetching room by ID:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {
    getAllRooms,
    getRoomById,
    getAvailableRooms,
    getRoomsAbovePrice,
    getRoomsBelowPrice,
    getRoomByName,
    getRoomsByCapacity
};
