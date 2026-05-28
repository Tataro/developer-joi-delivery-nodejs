const SeedData = require("../seedData/seedData");

const productService = {
  getProduct(productId, outletId) {
    const groceryProduct = SeedData.groceryProducts.find(
      (p) => p.productId === productId && p.store && p.store.outletId === outletId
    );
    if (groceryProduct) return groceryProduct;

    return SeedData.foodProducts.find(
      (p) => p.productId === productId && p.restaurant && p.restaurant.outletId === outletId
    );
  },
};

module.exports = productService;
