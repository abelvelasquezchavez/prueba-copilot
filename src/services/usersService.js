const db = require('../../db');

/**
 * Servicio de Usuarios
 * Contiene la lógica de negocio para gestionar usuarios
 */

const usersService = {
  /**
   * Obtener todos los usuarios
   * @returns {Array} Lista de usuarios
   */
  getAllUsers() {
    try {
      return db.prepare('SELECT * FROM users').all();
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  },

  /**
   * Obtener un usuario por ID
   * @param {number} id - ID del usuario
   * @returns {Object|null} Usuario encontrado o null
   */
  getUserById(id) {
    try {
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
      if (!user) {
        throw new Error(`Usuario con ID ${id} no encontrado`);
      }
      return user;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Crear un nuevo usuario
   * @param {string} name - Nombre del usuario
   * @param {string} email - Email del usuario
   * @returns {Object} Usuario creado
   */
  createUser(name, email) {
    try {
      if (!name || !email) {
        throw new Error('El nombre y email son requeridos');
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Formato de email inválido');
      }

      const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
      const info = stmt.run(name, email);
      
      return this.getUserById(info.lastInsertRowid);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Actualizar un usuario
   * @param {number} id - ID del usuario
   * @param {Object} data - Datos a actualizar (name, email)
   * @returns {Object} Usuario actualizado
   */
  updateUser(id, data) {
    try {
      // Verificar que el usuario existe
      this.getUserById(id);

      const { name, email } = data;

      // Si se proporciona email, validar formato
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new Error('Formato de email inválido');
        }
      }

      const stmt = db.prepare(
        'UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email) WHERE id = ?'
      );
      stmt.run(name, email, id);

      return this.getUserById(id);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Eliminar un usuario
   * @param {number} id - ID del usuario
   * @returns {boolean} True si se eliminó
   */
  deleteUser(id) {
    try {
      // Verificar que el usuario existe
      this.getUserById(id);

      const stmt = db.prepare('DELETE FROM users WHERE id = ?');
      const info = stmt.run(id);
      
      return info.changes > 0;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtener usuarios por nombre (búsqueda)
   * @param {string} name - Nombre a buscar
   * @returns {Array} Usuarios encontrados
   */
  searchUsersByName(name) {
    try {
      if (!name) {
        throw new Error('El nombre de búsqueda es requerido');
      }

      return db.prepare(
        'SELECT * FROM users WHERE name LIKE ?'
      ).all(`%${name}%`);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Verificar si un email ya existe
   * @param {string} email - Email a verificar
   * @returns {boolean} True si existe
   */
  emailExists(email) {
    try {
      const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
      return !!user;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = usersService;
