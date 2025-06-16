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
    getAllReservationsByStatus
};