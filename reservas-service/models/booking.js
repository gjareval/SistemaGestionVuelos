const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  flightId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flight", 
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
  },
  reservationDate: Date,
  status: {
    type: String,
    enum: ["Pendiente", "Confirmado", "Cancelado"],
    default: "Pendiente",
  },
});

module.exports = mongoose.model("Booking", BookingSchema);
