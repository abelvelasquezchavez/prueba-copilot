const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, 'data', 'dev.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

// Crear tablas si no existen
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

CREATE TABLE IF NOT EXISTS sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  productId INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  totalPrice REAL NOT NULL,
  saleDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'completed',
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);
`);

// Semilla de datos para pruebas
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

const saleCount = db.prepare('SELECT COUNT(*) AS c FROM sales').get().c;
if (saleCount === 0) {
  const insertSale = db.prepare('INSERT INTO sales (userId, productId, quantity, totalPrice, status) VALUES (?, ?, ?, ?, ?)');
  insertSale.run(1, 1, 2, 39.98, 'completed');
  insertSale.run(2, 2, 1, 9.5, 'completed');
}

module.exports = db;
