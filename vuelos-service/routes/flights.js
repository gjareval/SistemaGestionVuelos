const express = require("express");
const Flight = require("../models/flight");
const router = express.Router();

router.get("/", async (req, res) => {
  const { origin, destination, date } = req.query;
  try {
    const flights = await Flight.find({ 
        origin, 
        destination, 
        date: { $gte: new Date(date), $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)) } 
      });
    res.json(flights);
  } catch (err) {
    res.status(500).json({ error: "Error al buscar vuelos" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);

    if (!flight) {
      return res.status(404).json({ error: "Vuelo no encontrado" });
    }

    res.json(flight);
  } catch (error) {
    console.error("Error al obtener el vuelo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.put("/:id/reducirDisponibilidad", async (req, res) => {
  try {
    // Verificar si existe una reserva para este usuario y vuelo
    /*const reserva = await Booking.findOne({ 
      userId: req.user.id, 
      flightId: req.params.id,
      status: "Pendiente"  // O el estado que definas para reservas activas
    });

    if (!reserva) {
      return res.status(404).json({ error: "No se encontró una reserva activa para este vuelo" });
    }*/

    // Buscar el vuelo
    const vuelo = await Flight.findById(req.params.id);

    if (!vuelo) {
      return res.status(404).json({ error: "Vuelo no encontrado" });
    }

    if (vuelo.availability <= 0) {
      return res.status(400).json({ error: "No hay asientos disponibles" });
    }

    vuelo.availability -= 1;
    await vuelo.save();

    // Opcionalmente, puedes actualizar la reserva si es necesario
    // reserva.status = 'confirmed';  // O el estado que prefieras
    // await reserva.save();

    res.json({ message: "Disponibilidad actualizada", availability: vuelo.availability });
  } catch (error) {
    console.error("Error al actualizar disponibilidad:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.put("/:id/aumentarDisponibilidad", async (req, res) => {
  try {
    // Verificar si existe una reserva para este usuario y vuelo
    /*const reserva = await Booking.findOne({ 
      userId: req.user.id, 
      flightId: req.params.id,
      status: "Pendiente"  // O el estado que definas para reservas activas
    });

    if (!reserva) {
      return res.status(404).json({ error: "No se encontró una reserva activa para este vuelo" });
    }*/

    // Buscar el vuelo
    const vuelo = await Flight.findById(req.params.id);

    if (!vuelo) {
      return res.status(404).json({ error: "Vuelo no encontrado" });
    }

    vuelo.availability += 1;
    await vuelo.save();

    // Opcionalmente, puedes actualizar la reserva si es necesario
    // reserva.status = 'confirmed';  // O el estado que prefieras
    // await reserva.save();

    res.json({ message: "Disponibilidad actualizada", availability: vuelo.availability });
  } catch (error) {
    console.error("Error al actualizar disponibilidad:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


module.exports = router;
