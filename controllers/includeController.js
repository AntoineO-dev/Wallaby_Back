const includeService = require('../services/includeService');

async function getAllInclude(req, res) {
    try {
        const result = await inclureService.getAllInclude();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getIncludeByReservationId(req, res) {
    const id_reservation = req.params.id_reservation;
    try {
        const result = await inclureService.getIncludeByReservationId(id_reservation);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getTotalServicesByReservationId(req, res) {
    const id_reservation = req.params.id_reservation;
    try {
        const result = await inclureService.getTotalServicesByReservationId(id_reservation);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getIncludeByRoomName(req, res) {
    const room_name = req.params.room_name;
    try {
        const result = await inclureService.getIncludeByRoomName(room_name);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}   

async function getIncludeById(req, res) {
    const id = req.params.id;
    try {
        const result = await inclureService.getIncludeById(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function createInclude(req, res) {
    try {
        const result = await inclureService.createInclude(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateInclude(req, res) {
    const id = req.params.id;
    try {
        const result = await inclureService.updateInclude(id, req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function deleteInclude(req, res) {
    const id = req.params.id;
    try {
        await inclureService.deleteInclude(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllInclude,
    getIncludeByReservationId,
    getTotalServicesByReservationId,
    getIncludeByRoomName,
    getIncludeById,
    createInclude,
    updateInclude,
    deleteInclude
};