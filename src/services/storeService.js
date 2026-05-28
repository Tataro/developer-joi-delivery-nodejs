const SeedData = require("../seedData/seedData");

const storeService = {
  fetchStoreById(storeId) {
    return SeedData.stores.find((store) => store.outletId === storeId) || null;
  },
};

module.exports = storeService;
