const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', '..', '..', 'data', 'dev.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  description TEXT
);
`);

const userCount = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
if (userCount === 0) {
  const insertUser = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
  insertUser.run('Alice', 'alice@example.com');
  insertUser.run('Bob', 'bob@example.com');
}

const productCount = db.prepare('SELECT COUNT(*) AS c FROM products').get().c;
if (productCount === 0) {
  const insertProduct = db.prepare('INSERT INTO products (name, price, description) VALUES (?, ?, ?)');
  insertProduct.run('Camiseta', 19.99, 'Camiseta de algodón');
  insertProduct.run('Taza', 9.5, 'Taza cerámica 300ml');
}

module.exports = db;
