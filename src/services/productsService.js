const db = require('../../db');

/**
 * Servicio de Productos
 * Contiene la lógica de negocio para gestionar productos
 */

const productsService = {
  /**
   * Obtener todos los productos
   * @returns {Array} Lista de productos
   */
  getAllProducts() {
    try {
      return db.prepare('SELECT * FROM products').all();
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  },

  /**
   * Obtener un producto por ID
   * @param {number} id - ID del producto
   * @returns {Object|null} Producto encontrado o null
   */
  getProductById(id) {
    try {
      const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
      if (!product) {
        throw new Error(`Producto con ID ${id} no encontrado`);
      }
      return product;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Crear un nuevo producto
   * @param {string} name - Nombre del producto
   * @param {number} price - Precio del producto
   * @param {string} description - Descripción del producto
   * @returns {Object} Producto creado
   */
  createProduct(name, price, description) {
    try {
      if (!name || price == null) {
        throw new Error('El nombre y precio son requeridos');
      }

      // Validar que el precio sea un número positivo
      if (typeof price !== 'number' || price < 0) {
        throw new Error('El precio debe ser un número positivo');
      }

      const stmt = db.prepare(
        'INSERT INTO products (name, price, description) VALUES (?, ?, ?)'
      );
      const info = stmt.run(name, price, description || null);

      return this.getProductById(info.lastInsertRowid);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Actualizar un producto
   * @param {number} id - ID del producto
   * @param {Object} data - Datos a actualizar (name, price, description)
   * @returns {Object} Producto actualizado
   */
  updateProduct(id, data) {
    try {
      // Verificar que el producto existe
      this.getProductById(id);

      const { name, price, description } = data;

      // Si se proporciona precio, validar
      if (price != null) {
        if (typeof price !== 'number' || price < 0) {
          throw new Error('El precio debe ser un número positivo');
        }
      }

      const stmt = db.prepare(
        'UPDATE products SET name = COALESCE(?, name), price = COALESCE(?, price), description = COALESCE(?, description) WHERE id = ?'
      );
      stmt.run(name, price, description, id);

      return this.getProductById(id);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Eliminar un producto
   * @param {number} id - ID del producto
   * @returns {boolean} True si se eliminó
   */
  deleteProduct(id) {
    try {
      // Verificar que el producto existe
      this.getProductById(id);

      const stmt = db.prepare('DELETE FROM products WHERE id = ?');
      const info = stmt.run(id);

      return info.changes > 0;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Buscar productos por nombre
   * @param {string} name - Nombre a buscar
   * @returns {Array} Productos encontrados
   */
  searchProductsByName(name) {
    try {
      if (!name) {
        throw new Error('El nombre de búsqueda es requerido');
      }

      return db.prepare(
        'SELECT * FROM products WHERE name LIKE ?'
      ).all(`%${name}%`);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtener productos dentro de un rango de precios
   * @param {number} minPrice - Precio mínimo
   * @param {number} maxPrice - Precio máximo
   * @returns {Array} Productos en el rango
   */
  getProductsByPriceRange(minPrice, maxPrice) {
    try {
      if (minPrice == null || maxPrice == null) {
        throw new Error('Los precios mínimo y máximo son requeridos');
      }

      if (minPrice < 0 || maxPrice < 0 || minPrice > maxPrice) {
        throw new Error('Rango de precios inválido');
      }

      return db.prepare(
        'SELECT * FROM products WHERE price BETWEEN ? AND ? ORDER BY price ASC'
      ).all(minPrice, maxPrice);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtener productos ordenados por precio
   * @param {string} order - 'ASC' o 'DESC' (por defecto 'ASC')
   * @returns {Array} Productos ordenados
   */
  getProductsSortedByPrice(order = 'ASC') {
    try {
      const validOrder = ['ASC', 'DESC'].includes(order.toUpperCase()) 
        ? order.toUpperCase() 
        : 'ASC';

      return db.prepare(
        `SELECT * FROM products ORDER BY price ${validOrder}`
      ).all();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtener el precio promedio de los productos
   * @returns {number} Precio promedio
   */
  getAveragePrice() {
    try {
      const result = db.prepare('SELECT AVG(price) AS avg FROM products').get();
      return result.avg || 0;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = productsService;
