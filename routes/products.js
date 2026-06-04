const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /products
router.get('/', (req, res) => {
  const products = db.prepare('SELECT * FROM products').all();
  res.json(products);
});

// GET /products/:id
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// POST /products
router.post('/', (req, res) => {
  const { name, price, description } = req.body;
  if (!name || price == null) return res.status(400).json({ error: 'name and price are required' });
  try {
    const stmt = db.prepare('INSERT INTO products (name, price, description) VALUES (?, ?, ?)');
    const info = stmt.run(name, price, description || null);
    const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /products/:id
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const { name, price, description } = req.body;
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  const stmt = db.prepare('UPDATE products SET name = COALESCE(?, name), price = COALESCE(?, price), description = COALESCE(?, description) WHERE id = ?');
  try {
    stmt.run(name, price, description, id);
    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /products/:id
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const stmt = db.prepare('DELETE FROM products WHERE id = ?');
  const info = stmt.run(id);
  if (info.changes === 0) return res.status(404).json({ error: 'Product not found' });
  res.status(204).end();
});

module.exports = router;
