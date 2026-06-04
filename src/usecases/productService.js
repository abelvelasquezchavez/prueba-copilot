function createProductService({ productRepository }) {
  return {
    getAllProducts() {
      return productRepository.getAll();
    },

    getProductById(id) {
      return productRepository.findById(id);
    },

    createProduct(data) {
      if (!data.name || data.price == null) {
        throw new Error('name and price are required');
      }
      return productRepository.create(data);
    },

    updateProduct(id, data) {
      const product = productRepository.findById(id);
      if (!product) return null;
      return productRepository.update(id, data);
    },

    deleteProduct(id) {
      return productRepository.delete(id);
    },
  };
}

module.exports = createProductService;
