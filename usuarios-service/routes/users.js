const express = require("express");
const router = express.Router();
const axios = require("axios"); 

router.get("/:usuarioId/reservas", async (req, res) => {
    try {
      const { usuarioId } = req.params;
  
      const token = req.headers['authorization']?.split(' ')[1];
      const { data: reservas }  = await axios.get(`http://reservas-service:3001/api/reservas/${usuarioId}`, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
  
  

  
      res.json(reservas);
    } catch (error) {
      console.error("Error al obtener las reservas del usuario:", error);
      return res.status(404).json({ message: "No se encontraron reservas para este usuario" });
    }
  });


module.exports = router;
