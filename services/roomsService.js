const pool = require('../config/bdd');

async function getAllRooms() {
   try {
    const [results] = await pool.query('SELECT * FROM rooms');
    return results;
   } catch (error) {
    throw error;
   }
}

async function getAvailableRooms() {
   try {
    const [results] = await pool.query('SELECT room_name, capacity, price_per_night, status, description FROM rooms WHERE status = "available"');
    return results;
   } catch (error) {
    console.error('Error fetching available rooms:', error);
    throw error;
   }
}

async function getRoomsAbovePrice(pricePerNight) {
   try {
    const [results] = await pool.query(
      'SELECT room_name, price_per_night, status, description FROM rooms WHERE price_per_night > ?', 
      [pricePerNight]
    );
    return results;
   } catch (error) {
    console.error('Error fetching rooms above price:', error);
    throw error;
   }
}

async function getRoomsBelowPrice(pricePerNight) {
   try {
    const [results] = await pool.query(
      'SELECT room_name, price_per_night, status, description FROM rooms WHERE price_per_night < ?', 
      [pricePerNight]
    );
    return results;
   } catch (error) {
    console.error('Error fetching rooms below price:', error);
    throw error;
   }
}

async function getRoomByName(roomName) {
   try {
    const [results] = await pool.query(
      'SELECT room_name, status, description, price_per_night FROM rooms WHERE room_name = ?', 
      [roomName]
    );
    if (results.length === 0) {
      return null; // No room found
    }
    return results[0];
   } catch (error) {
    console.error('Error fetching room by name:', error);
    throw error;
   }
}

async function getRoomsByCapacity(capacity) {
   try {
    const [results] = await pool.query(
      'SELECT room_name, capacity, price_per_night, status, description FROM rooms WHERE capacity >= ?', 
      [capacity]
    );
    return results;
   } catch (error) {
    console.error('Error fetching rooms by capacity:', error);
    throw error;
   }
}

async function getRoomById(roomId) {
   try {
    const [results] = await pool.query(
      'SELECT * FROM rooms WHERE id_room = ?', 
      [roomId]
    );
    if (results.length === 0) {
      return null; // No room found
    }
    return results[0];
   } catch (error) {
    console.error('Error fetching room by ID:', error);
    throw error;
   }
}

async function createRoom(roomData) {
   try {
    const { room_name, capacity, price_per_night, status, description } = roomData;
    const [result] = await pool.query(
      'INSERT INTO rooms (room_name, capacity, price_per_night, status, description) VALUES (?, ?, ?, ?, ?)', 
      [room_name, capacity, price_per_night, status, description]
    );
    return result.insertId;
   } catch (error) {
    console.error('Error creating room:', error);
    throw error;
   }
}

async function updateRoom(roomId, updatedData) {
   try {
    const { room_name, capacity, price_per_night, status, description } = updatedData;
    const [result] = await pool.query(
      'UPDATE rooms SET room_name = ?, capacity = ?, price_per_night = ?, status = ?, description = ? WHERE id_room = ?', 
      [room_name, capacity, price_per_night, status, description, roomId]
    );
    if (result.affectedRows === 0) {
      return null; // No room found
    }
    return updatedData;
   } catch (error) {
    console.error('Error updating room:', error);
    throw error;
   }
}

async function deleteRoom(roomId) {
   try {
    const [result] = await pool.query('DELETE FROM rooms WHERE id_room = ?', [roomId]);
    return result.affectedRows > 0;
   } catch (error) {
    console.error('Error deleting room:', error);
    throw error;
   }
}

async function getRoomDetails(roomId) {
   try {
    const [rooms] = await pool.query(
      'SELECT * FROM rooms WHERE id_room = ?',
      [roomId]
    );
    
    if (rooms.length === 0) {
      throw new Error('Chambre non trouvée');
    }
    
    return rooms[0];
   } catch (error) {
    console.error('Erreur lors de la récupération des détails de la chambre:', error);
    throw error;
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
  getRoomDetails
};