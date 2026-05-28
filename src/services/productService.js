const SeedData = require("../seedData/seedData");

const productService = {
  getProduct(productId, outletId) {
    return (
      this.getGroceryProduct(productId, outletId) ||
      this.getFoodProduct(productId, outletId)
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
};

module.exports = productService;
