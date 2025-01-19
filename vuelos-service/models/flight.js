const mongoose = require("mongoose");

const FlightSchema = new mongoose.Schema({
  origin: String,
  destination: String,
  date: Date,
  time: String,
  availability: Number,
});

module.exports = mongoose.model("Vuelo", FlightSchema);
