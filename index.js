const express = require('express');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const db = require('./db'); // inicializa DB y seeds

const app = express();
app.use(express.json());

app.use('/users', usersRouter);
app.use('/products', productsRouter);

app.get('/', (req, res) => res.json({ message: 'API simple: /users y /products' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server escuchando en http://localhost:${PORT}`));
