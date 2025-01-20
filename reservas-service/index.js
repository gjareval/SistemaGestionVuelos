require("dotenv").config();
const express = require("express");
const app = express();
const axios = require('axios');

const bookingRoutes = require("./routes/bookings");

const authenticateToken = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).send({ message: "No token provided" });
  }

  try {

    const response = await axios.post("http://auth-service:4000/auth/validate-token", { token });
    if (response.status === 200) {
      req.user = response.data.decoded;
      next();
    } else {
      return res.status(401).send({ message: "Token is not valid" });
    }
  } catch (error) {
    console.error("Error validating token", error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

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
