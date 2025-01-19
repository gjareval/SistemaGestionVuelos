require("dotenv").config();
const express = require("express");
const app = express();

const flightRoutes = require("./routes/flights");

app.use(express.json());
app.use("/api/vuelos", flightRoutes);

const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Conectado a la base de datos"))
  .catch((err) => console.error("Error al conectar a la base de datos:", err));

app.get("/", (req, res) => {
  res.send("Servicio vuelo funcionando");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en el puerto ${PORT}`));
