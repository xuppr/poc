const storage = require("./store/storage");
const cryptography = require("./cryptography/cryptography");

module.exports = {
  getByFilter: storage.getByFilter,
  getAll: storage.getAll,
  getById: storage.getById,
  writeAccount: storage.addNew,
  deleteById: storage.deleteById,
  erase: storage.erase,
  validatePin: cryptography.validatePin,
  initializePin: cryptography.initializePassphrase,
  isPinInitialized: cryptography.isPassphraseInitialized,
};
