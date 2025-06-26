const roomsService = require('../services/roomsService');

function fixEncoding(obj) {
    if (typeof obj === 'string') {
        return obj.replace(/\?/g, "'");
    }
    if (Array.isArray(obj)) {
        return obj.map(fixEncoding);
    }
    if (obj && typeof obj === 'object') {
        const fixed = {};
        for (let key in obj) {
            fixed[key] = fixEncoding(obj[key]);
        }
        return fixed;
    }
    return obj;
}

async function getAllRooms(req, res) {
    try {
        const rooms = await roomsService.getAllRooms();
        res.status(200).json(fixEncoding(rooms));
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function getAvailableRooms(req, res) {
    try {
        const availableRooms = await roomsService.getAvailableRooms();
        res.status(200).json(fixEncoding(availableRooms));
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
        res.status(200).json(fixEncoding(rooms));
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
        res.status(200).json(fixEncoding(rooms));
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
            res.status(200).json(fixEncoding(room));
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
        res.status(200).json(fixEncoding(rooms));
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
            res.status(200).json(fixEncoding(room));
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        console.error('Error fetching room by ID:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function createRoom(req, res) {
    try {
        const newRoom = req.body;
        const createdRoom = await roomsService.createRoom(newRoom);
        res.status(201).json(fixEncoding(createdRoom));
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function updateRoom(req, res) {
    try {
        const roomId = req.params.id;
        const updatedRoomData = req.body;
        const updatedRoom = await roomsService.updateRoom(roomId, updatedRoomData);
        if (updatedRoom) {
            res.status(200).json(fixEncoding(updatedRoom));
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        console.error('Error updating room:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function deleteRoom(req, res) {
    try {
        const roomId = req.params.id;
        const deleted = await roomsService.deleteRoom(roomId);
        if (deleted) {
            res.status(204).send(); // No content
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        console.error('Error deleting room:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function getRoomDetails(req, res) {
    try {
        const roomId = req.params.id;
        
        if (!roomId) {
            return res.status(400).json({ message: 'ID de chambre requis' });
        }
        
        const roomDetails = await reservationsService.getRoomDetails(roomId);
        res.status(200).json(fixEncoding(roomDetails));
    } catch (error) {
        console.error('Error fetching room details:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

module.exports = {
    getAllRooms,
    getRoomById,
    getAvailableRooms,
    getRoomsAbovePrice,
    getRoomsBelowPrice,
    getRoomByName,
    getRoomsByCapacity,
    createRoom,
    updateRoom,
    deleteRoom,
    getRoomDetails,
    fixEncoding
};
