const express = require("express");
const Booking = require("../models/booking");
const axios = require("axios"); 
const router = express.Router();

router.get("/:idUsuario", async (req, res) => {
  try {
      const userId = req.params.idUsuario;

      const reservas = await Booking.find({ userId });

      if (!reservas.length) {
          return res.status(404).json({ error: "No se encontraron reservas para este usuario" });
      }

      const reservasConDetalles = await Promise.all(
          reservas.map(async (reserva) => {
              try {
                  const vueloResponse = await axios.get(`http://vuelos-service:3000/api/vuelos/${reserva.flightId}`);
                  const vuelo = vueloResponse.status === 200 ? vueloResponse.data : null;
                  return { ...reserva.toObject(), flightDetails: vuelo };
              } catch (error) {
                  console.error("Error al obtener los detalles del vuelo:", error);
                  return { ...reserva.toObject(), flightDetails: null };
              }
          })
      );

      res.json(reservasConDetalles);
  } catch (error) {
      console.error("Error al obtener las reservas:", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
});


router.post("/", async (req, res) => {
    try {
      const userId = req.user.id;
      const { flightId } = req.body;
  
      if (!flightId) {
        return res.status(400).json({ error: "El ID del vuelo es requerido" });
      }
  
      const flightResponse = await axios.get(`http://vuelos-service:3000/api/vuelos/${flightId}`);
  
      if (flightResponse.status !== 200) {
        return res.status(404).json({ error: "Vuelo no encontrado" });
      }
  
      const vuelo = flightResponse.data;
  
      if (vuelo.availability <= 0) {
        return res.status(400).json({ error: "No hay asientos disponibles" });
      }
  
      const nuevaReserva = new Booking({
        flightId,
        userId
      });
  
      await nuevaReserva.save();
  
      await axios.put(`http://vuelos-service:3000/api/vuelos/${flightId}/reducirDisponibilidad`);
  
      res.status(201).json({ message: "Reserva creada con éxito", reserva: nuevaReserva });
    } catch (error) {
      console.error("Error al realizar la reserva:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
      const userId = req.user.id;
      const reservaId = req.params.id;
  
      const reserva = await Booking.findById(reservaId);
  
      if (!reserva) {
        return res.status(404).json({ error: "Reserva no encontrada" });
      }
  
      if (reserva.userId != userId) {
        return res.status(403).json({ error: "No puedes eliminar una reserva que no te pertenece" });
      }
  
      const vuelo = await axios.get(`http://vuelos-service:3000/api/vuelos/${reserva.flightId}`);
  
      if (!vuelo) {
        return res.status(404).json({ error: "Vuelo no encontrado" });
      }
  
      await reserva.deleteOne(); 
  
      await axios.put(`http://vuelos-service:3000/api/vuelos/${reserva.flightId}/aumentarDisponibilidad`);
  
      res.status(200).json({ message: "Reserva eliminada con éxito" });
    } catch (error) {
      console.error("Error al eliminar la reserva:", error);
    }
  });

module.exports = router;