const SeedData = require("../seedData/seedData");

const productService = {
  getProduct(productId, outletId) {
    return (
      this.getGroceryProduct(productId, outletId) ||
      this.getFoodProduct(productId, outletId) ||
      this.getHouseholdProduct(productId, outletId) ||
      this.getMedicineProduct(productId, outletId) ||
      this.getElectronicsProduct(productId, outletId)
    );
  },

  getGroceryProduct(productId, outletId) {
    return SeedData.groceryProducts.find(
      (groceryProduct) =>
        groceryProduct.productId === productId &&
        groceryProduct.store &&
        groceryProduct.store.outletId === outletId,
    );
  },

  getFoodProduct(productId, outletId) {
    return SeedData.foodProducts.find(
      (foodProduct) =>
        foodProduct.productId === productId &&
        foodProduct.restaurant &&
        foodProduct.restaurant.outletId === outletId &&
        foodProduct.available,
    );
  },

  getHouseholdProduct(productId, outletId) {
    return SeedData.householdProducts.find(
      (householdProduct) =>
        householdProduct.productId === productId &&
        householdProduct.store &&
        householdProduct.store.outletId === outletId,
    );
  },

  getMedicineProduct(productId, outletId) {
    return SeedData.medicineProducts.find(
      (medicineProduct) =>
        medicineProduct.productId === productId &&
        medicineProduct.store &&
        medicineProduct.store.outletId === outletId,
    );
  },

  getElectronicsProduct(productId, outletId) {
    return SeedData.electronicProducts.find(
      (electronicsProduct) =>
        electronicsProduct.productId === productId &&
        electronicsProduct.store &&
        electronicsProduct.store.outletId === outletId,
    );
  },
};

module.exports = productService;
