const express = require("express");
const proxy = require("http-proxy-middleware"); // Asegúrate de instalarlo con `npm install http-proxy-middleware`
const app = express();

app.use("/auth", proxy.createProxyMiddleware({ target: "http://auth-service:3000", changeOrigin: true }));
app.use("/reservas", proxy.createProxyMiddleware({ target: "http://reservas-service:3000", changeOrigin: true }));
app.use("/usuarios", proxy.createProxyMiddleware({ target: "http://usuarios-service:3000", changeOrigin: true }));
app.use("/vuelos", proxy.createProxyMiddleware({ target: "http://vuelos-service:3000", changeOrigin: true }));

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`API Gateway corriendo en el puerto ${PORT}`);
});
