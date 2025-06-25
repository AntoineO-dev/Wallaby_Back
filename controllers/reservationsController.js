const reservationsService = require('../services/reservationsService');

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

async function createReservation(req, res) {
    const newReservation = req.body;
    try {
        // 1. Vérifier que les données nécessaires sont présentes
        if (!newReservation.id_room || !newReservation.id_customer || 
            !newReservation.check_in_date || !newReservation.check_out_date) {
            return res.status(400).json({ 
                message: 'Données de réservation incomplètes. Veuillez fournir id_room, id_customer, check_in_date et check_out_date.'
            });
        }

        // 2. Vérifier que la chambre existe et est disponible
        const roomAvailability = await reservationsService.checkRoomAvailability(
            newReservation.id_room,
            newReservation.check_in_date,
            newReservation.check_out_date
        );

        if (!roomAvailability.isAvailable) {
            return res.status(409).json({ 
                message: 'La chambre n\'est pas disponible pour les dates sélectionnées',
                conflictingReservations: roomAvailability.conflictingReservations
            });
        }

        // 3. Calculer le prix total en fonction de la durée du séjour et du prix de la chambre
        const roomDetails = await reservationsService.getRoomDetails(newReservation.id_room);
        const checkIn = new Date(newReservation.check_in_date);
        const checkOut = new Date(newReservation.check_out_date);
        const numberOfNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        
        if (numberOfNights <= 0) {
            return res.status(400).json({ 
                message: 'Les dates de séjour sont invalides. La date de départ doit être postérieure à la date d\'arrivée.'
            });
        }

        // Calcul du prix total
        const totalCost = numberOfNights * roomDetails.price_per_night;
        
        // 4. Ajouter les informations supplémentaires à la réservation
        const completeReservation = {
            ...newReservation,
            total_cost: totalCost,
            reservation_status: 'pending' // Par défaut, les réservations sont en attente
        };

        // 5. Créer la réservation
        const reservationId = await reservationsService.createReservation(completeReservation);
        
        // 6. Réponse avec le succès et les détails
        res.status(201).json({ 
            message: 'Réservation créée avec succès', 
            id: reservationId,
            reservation: {
                ...completeReservation,
                id_reservation: reservationId
            }
        });
        
    } catch (error) {
        console.error('Error creating reservation:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

async function updateReservation(req, res) {
    const reservationId = req.params.id;
    const updatedData = req.body;
    try {
        const success = await reservationsService.updateReservation(reservationId, updatedData);
        if (success) {
            res.status(200).json({ message: 'Reservation updated successfully' });
        } else {
            res.status(404).json({ message: 'Reservation not found' });
        }
    } catch (error) {
        console.error('Error updating reservation:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function deleteReservation(req, res) {
    const reservationId = req.params.id;
    try {
        const success = await reservationsService.deleteReservation(reservationId);
        if (success) {
            res.status(200).json({ message: 'Reservation deleted successfully' });
        } else {
            res.status(404).json({ message: 'Reservation not found' });
        }
    } catch (error) {
        console.error('Error deleting reservation:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Fonction pour valider/confirmer une réservation
const confirmReservation = async (req, res) => {
    try {
        const reservationId = req.params.id;
        
        // Vérifier d'abord que la réservation existe
        const [reservation] = await pool.query(
            'SELECT * FROM reservations WHERE id_reservation = ?',
            [reservationId]
        );
        
        if (reservation.length === 0) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }
        
        // Mettre à jour le statut de la réservation à "confirmed"
        await pool.query(
            'UPDATE reservations SET reservation_status = ? WHERE id_reservation = ?',
            ['confirmed', reservationId]
        );
        
        // Optionnel: Mettre à jour la disponibilité de la chambre
        await pool.query(
            'UPDATE rooms SET reservation_status = ? WHERE id_room = ?',
            ['occupied', reservation[0].id_room]
        );
        
        return res.status(200).json({ 
            message: 'Réservation confirmée avec succès',
            id_reservation: reservationId
        });
    } catch (error) {
        console.error('Erreur lors de la confirmation de la réservation:', error);
        return res.status(500).json({ 
            message: 'Erreur lors de la confirmation de la réservation', 
            error: error.message 
        });
    }
};

async function checkAvailability(req, res) {
    try {
        const { roomId, checkInDate, checkOutDate } = req.query;
        
        if (!roomId || !checkInDate || !checkOutDate) {
            return res.status(400).json({ 
                message: 'Paramètres manquants. roomId, checkInDate et checkOutDate sont requis.' 
            });
        }
        
        const availability = await reservationsService.checkRoomAvailability(
            roomId, checkInDate, checkOutDate
        );
        
        res.status(200).json(availability);
    } catch (error) {
        console.error('Error checking room availability:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}





module.exports = {
    getAllReservations,
    getReservationById,
    getAllReservationsByStatus,
    getAverageCost,
    getAboveTotalCost,
    getBelowTotalCost,
    getReservationsByRoomName,
    createReservation,
    updateReservation,
    deleteReservation,
    confirmReservation,
    checkAvailability,
    
};