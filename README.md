API simple Node + Express

Rutas:
- GET /users
- GET /users/:id
- POST /users  { name, email }
- PUT /users/:id { name?, email? }
- DELETE /users/:id

- GET /products
- GET /products/:id
- POST /products { name, price, description? }
- PUT /products/:id { name?, price?, description? }
- DELETE /products/:id

Instalación:
1. npm install
2. npm start

La base de datos SQLite se crea en ./data/dev.db y viene con algunos registros de prueba.
