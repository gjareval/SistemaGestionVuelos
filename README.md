# Sistema de gestión de vuelos

## Cómo inicializar el proyecto
**1. Clonar el repositorio**
```
https://github.com/gjareval/SistemaGestionVuelos.git
```
**2. Entrar al directorio del proyecto**
```
cd SistemaGestionVuelos

```

**3. Dentro de cada microservicio (auth, vuelos, reservas, usuarios, gateway) ejecutar lo siguiente**
```
npm install
```

**4. Dentro de cada microservicio crear una copia del archivo .env.example y renombrarlo como .env. Introducir el link de la base de datos y el código secreto para los tokens**
```
PORT=3002
DB_URI=<mongoDBLink>
JWT_SECRET=<secret>
```

**5. En la ruta raíz del proyecto ejecutar lo siguiente para correr el sistema**
```
sudo docker-compose build
sudo docker-compose up
```

**6. Para detener el sistema ejecutar lo siguiente**
```
sudo docker-compose down
```
