const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /users
router.get('/', (req, res) => {
  const users = db.prepare('SELECT * FROM users').all();
  res.json(users);
});

// GET /users/:id
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// POST /users
router.post('/', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'name and email are required' });
  try {
    const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
    const info = stmt.run(name, email);
    const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /users/:id
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const { name, email } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const stmt = db.prepare('UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email) WHERE id = ?');
  try {
    stmt.run(name, email, id);
    const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /users/:id
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const stmt = db.prepare('DELETE FROM users WHERE id = ?');
  const info = stmt.run(id);
  if (info.changes === 0) return res.status(404).json({ error: 'User not found' });
  res.status(204).end();
});

module.exports = router;
