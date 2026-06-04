function createUserService({ userRepository }) {
  return {
    getAllUsers() {
      return userRepository.getAll();
    },

    getUserById(id) {
      return userRepository.findById(id);
    },

    createUser(data) {
      if (!data.name || !data.email) {
        throw new Error('name and email are required');
      }
      return userRepository.create(data);
    },

    updateUser(id, data) {
      const user = userRepository.findById(id);
      if (!user) return null;
      return userRepository.update(id, data);
    },

    deleteUser(id) {
      return userRepository.delete(id);
    },
  };
}

module.exports = createUserService;
