# Instrucciones para Copilot (node-express-copilot)

Este archivo ayuda a futuras sesiones de Copilot/Agentes a entender cómo ejecutar, probar y modificar este proyecto. Especifica comandos concretos, arquitectura de alto nivel y convenciones clave del repositorio.

---

## Comandos útiles (Build / Run / Test / Lint)

- Instalar dependencias:
  - npm install
- Ejecutar (producción / simple):
  - npm start        # node index.js
- Ejecutar en desarrollo (auto-reload):
  - npm run dev      # nodemon index.js

Notas:
- No hay scripts de test ni lint configurados en package.json. Si se añaden tests, seguir la convención de npm test y documentar cómo ejecutar una única prueba (por ejemplo: npm test -- path/to/test o npm run test -- -t "name").

---

## Arquitectura de alto nivel

- Entrada principal: index.js — crea la app Express y monta rutas.
  - Rutas esperadas: /users y /products (index.js hace require('./routes/users') y ('./routes/products')).
  - Si las rutas no existen, comprobar la carpeta routes/ o crear implementaciones en routes/{users,products}.js.

- Persistencia: db.js — usa better-sqlite3 y crea ./data/dev.db (se crea la carpeta data si hace falta).
  - db.js crea tablas `users` y `products` y aplica seeds iniciales si las tablas están vacías.
  - Exporta el objeto db para usarse desde los routers.

- API expuesta (según README):
  - Users: GET /users, GET /users/:id, POST /users, PUT /users/:id, DELETE /users/:id
  - Products: GET /products, GET /products/:id, POST /products, PUT /products/:id, DELETE /products/:id

- Convenciones de datos:
  - La BD está en SQLite en ruta ./data/dev.db (local, no en memoria).
  - users.email tiene UNIQUE constraint.
  - products.price se almacena como REAL.

---

## Convenciones y pautas específicas del repositorio

- Mensajes y documentación en español: cuando se interactúe con Copilot/Agentes en este repo, preferir respuestas en español y ser conciso.
- Cambios quirúrgicos: tocar solo los archivos necesarios para una tarea. No refactorizar código que no está relacionado con la petición.
- Seeds en db.js: la semilla sólo se inserta si la tabla está vacía — evita duplicados automáticos.
- Rutas: seguir la estructura REST descrita en README.md; los handlers deben usar el db exportado por db.js.
- Manejo de errores: este proyecto es intencionalmente simple; si añades validaciones, documenta los endpoints afectados.

---

## Qué buscar al ayudar con cambios o PRs

- Confirmar que ./data/dev.db puede crearse con permisos de escritura.
- Validar que no se rompa la semilla (no insertar duplicados).
- Si añades tests, incluir npm script `test` y documentar cómo ejecutar pruebas individuales.
- Si se añaden linters o formateadores, actualiza `package.json` y agrega instrucciones concretas aquí.

---

## Guía breve para el asistente (comportamiento esperado)

- Responder en español. Ser conciso.
- Antes de aplicar cambios, listar los archivos que se van a modificar y explicar brevemente el plan (objetivos y verificación).
- Ejecutar cambios mínimos y verificar con `npm start` o `node index.js` según corresponda.
- Si faltan piezas importantes (por ejemplo la carpeta routes/), notificar al usuario y proponer crear los archivos faltantes.

---

(Se conservan las siguientes pautas de trabajo para LLMs: pensar antes de codificar, preferir simplicidad, hacer cambios quirúrgicos y definir criterios de éxito.)

Cuando interactúes aquí, usa español.
