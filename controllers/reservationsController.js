reservationsService = require('../services/reservationsService');

async function getAllReservations(req, res) {
    try {
        const reservations = await reservationsService.getAllReservations();
        res.status(200).json(reservations);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function getAllReservationsByStatus(req, res) {
    const reservationStatus = req.params.reservation_status;
    try {
        const reservations = await reservationsService.getAllReservationsByStatus(reservationStatus);
        res.status(200).json(reservations);
    } catch (error) {
        console.error('Error fetching reservations by status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function getAverageCost(req, res) {
    try {
        const averageCost = await reservationsService.getAverageCost();
        res.status(200).json({ averageCost });
    } catch (error) {
        console.error('Error fetching average cost:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function getAboveTotalCost(req, res) {
    const totalCost = req.params.total_cost;
    try {
        const reservations = await reservationsService.getAboveTotalCost(totalCost);
        res.status(200).json(reservations);
    } catch (error) {
        console.error('Error fetching reservations above total cost:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function getBelowTotalCost(req, res) {
    const totalCost = req.params.total_cost;
    try {
        const reservations = await reservationsService.getAboveTotalCost(totalCost);
        res.status(200).json(reservations);
    } catch (error) {
        console.error('Error fetching reservations below total cost:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function getReservationsByRoomName(req, res) {
    const roomName = req.params.room_name;
    try {
        const reservations = await reservationsService.getReservationsByRoomName(roomName);
        res.status(200).json(reservations);
    } catch (error) {
        console.error('Error fetching reservations by room name:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function getReservationById(req, res) {
    const reservationId = req.params.id;
    try {
        const reservation = await reservationsService.getReservationById(reservationId);
        if (reservation) {
            res.status(200).json(reservation);
        } else {
            res.status(404).json({ message: 'Reservation not found' });
        }
    } catch (error) {
        console.error('Error fetching reservation:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {
    getAllReservations,
    getReservationById,
    getAllReservationsByStatus,
    getAverageCost,
    getAboveTotalCost,
    getBelowTotalCost,
    getReservationsByRoomName
};