const SeedData = require("../seedData/seedData");

const productService = {
  // Finds a product across both catalogs. Grocery items reference their outlet
  // via `store`, food items via `restaurant` — the cart treats both as a Product,
  // so a single lookup keeps the cart flow polymorphic.
  getProduct(productId, outletId) {
    const groceryProduct = SeedData.groceryProducts.find(
      (product) =>
        product.productId === productId &&
        product.store &&
        product.store.outletId === outletId,
    );
    if (groceryProduct) {
      return groceryProduct;
    }

    return SeedData.foodProducts.find(
      (product) =>
        product.productId === productId &&
        product.restaurant &&
        product.restaurant.outletId === outletId,
    );
  },
};

module.exports = productService;
