const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /sales - Obtener todas las ventas
router.get('/', (req, res) => {
  try {
    const sales = db.prepare('SELECT * FROM sales').all();
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /sales/:id - Obtener una venta por ID
router.get('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const sale = db.prepare('SELECT * FROM sales WHERE id = ?').get(id);
    if (!sale) return res.status(404).json({ error: 'Venta no encontrada' });
    res.json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /sales - Crear una nueva venta
router.post('/', (req, res) => {
  try {
    const { userId, productId, quantity, status } = req.body;

    // Validar campos requeridos
    if (!userId || !productId || !quantity) {
      return res.status(400).json({ error: 'userId, productId y quantity son requeridos' });
    }

    // Validar que el usuario existe
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Validar que el producto existe y obtener su precio
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Validar cantidad
    if (quantity <= 0) {
      return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });
    }

    // Calcular total
    const totalPrice = product.price * quantity;

    // Insertar venta
    const stmt = db.prepare(
      'INSERT INTO sales (userId, productId, quantity, totalPrice, status) VALUES (?, ?, ?, ?, ?)'
    );
    const info = stmt.run(userId, productId, quantity, totalPrice, status || 'completed');

    // Obtener la venta creada
    const newSale = db.prepare('SELECT * FROM sales WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(newSale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /sales/:id - Actualizar una venta
router.put('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const { quantity, status } = req.body;

    // Verificar que la venta existe
    const sale = db.prepare('SELECT * FROM sales WHERE id = ?').get(id);
    if (!sale) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    // Si se actualiza cantidad, recalcular totalPrice
    let totalPrice = sale.totalPrice;
    if (quantity) {
      if (quantity <= 0) {
        return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });
      }
      const product = db.prepare('SELECT * FROM products WHERE id = ?').get(sale.productId);
      totalPrice = product.price * quantity;
    }

    // Actualizar venta
    const stmt = db.prepare(
      'UPDATE sales SET quantity = COALESCE(?, quantity), totalPrice = COALESCE(?, totalPrice), status = COALESCE(?, status) WHERE id = ?'
    );
    stmt.run(quantity, totalPrice, status, id);

    // Obtener venta actualizada
    const updated = db.prepare('SELECT * FROM sales WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /sales/:id - Eliminar una venta
router.delete('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const stmt = db.prepare('DELETE FROM sales WHERE id = ?');
    const info = stmt.run(id);

    if (info.changes === 0) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /sales/user/:userId - Obtener ventas de un usuario
router.get('/user/:userId', (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const sales = db.prepare('SELECT * FROM sales WHERE userId = ?').all(userId);
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /sales/product/:productId - Obtener ventas de un producto
router.get('/product/:productId', (req, res) => {
  try {
    const productId = Number(req.params.productId);
    const sales = db.prepare('SELECT * FROM sales WHERE productId = ?').all(productId);
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
