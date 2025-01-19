require("dotenv").config();
const express = require("express");
const app = express();
const authenticateToken = require('../auth-service/middleware/auth');

const bookingRoutes = require("./routes/bookings");

app.use(express.json());
app.use("/api/reservas", authenticateToken, bookingRoutes);

const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Conectado a la base de datos"))
  .catch((err) => console.error("Error al conectar a la base de datos:", err));

app.get("/", (req, res) => {
  res.send("Servicio reservas funcionando");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor en el puerto ${PORT}`));
