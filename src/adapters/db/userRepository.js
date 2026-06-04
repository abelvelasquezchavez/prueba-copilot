class SqliteUserRepository {
  constructor(db) {
    this.db = db;
  }

  getAll() {
    return this.db.prepare('SELECT * FROM users').all();
  }

  findById(id) {
    return this.db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  }

  create({ name, email }) {
    const stmt = this.db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
    const info = stmt.run(name, email);
    return this.findById(info.lastInsertRowid);
  }

  update(id, { name, email }) {
    const stmt = this.db.prepare(
      'UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email) WHERE id = ?'
    );
    stmt.run(name, email, id);
    return this.findById(id);
  }

  delete(id) {
    const stmt = this.db.prepare('DELETE FROM users WHERE id = ?');
    return stmt.run(id).changes;
  }
}

module.exports = SqliteUserRepository;
