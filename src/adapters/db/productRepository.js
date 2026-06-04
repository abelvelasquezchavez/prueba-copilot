class SqliteProductRepository {
  constructor(db) {
    this.db = db;
  }

  getAll() {
    return this.db.prepare('SELECT * FROM products').all();
  }

  findById(id) {
    return this.db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  }

  create({ name, price, description }) {
    const stmt = this.db.prepare(
      'INSERT INTO products (name, price, description) VALUES (?, ?, ?)' 
    );
    const info = stmt.run(name, price, description || null);
    return this.findById(info.lastInsertRowid);
  }

  update(id, { name, price, description }) {
    const stmt = this.db.prepare(
      'UPDATE products SET name = COALESCE(?, name), price = COALESCE(?, price), description = COALESCE(?, description) WHERE id = ?'
    );
    stmt.run(name, price, description, id);
    return this.findById(id);
  }

  delete(id) {
    const stmt = this.db.prepare('DELETE FROM products WHERE id = ?');
    return stmt.run(id).changes;
  }
}

module.exports = SqliteProductRepository;
