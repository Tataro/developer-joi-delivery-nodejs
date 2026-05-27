const SeedData = require("../seedData/seedData");

const productService = {
  getProduct(productId, outletId) {
    const groceryProduct = SeedData.groceryProducts.find(
      (product) =>
        product.productId === productId &&
        product.store &&
        product.store.outletId === outletId
    );
    if (groceryProduct) {
      return groceryProduct;
    }

    return SeedData.foodProducts.find(
      (product) =>
        product.productId === productId &&
        product.restaurant &&
        product.restaurant.outletId === outletId
    );
  },
};

module.exports = productService;
