const SeedData = require("../seedData/seedData");

const productService = {
  getProduct(productId, outletId) {
    const product = SeedData.groceryProducts.find((groceryProduct) => {
      return (
        groceryProduct.productId === productId &&
        groceryProduct.store &&
        groceryProduct.store.outletId === outletId
      );
    });
    return product;
  },
};

module.exports = productService;
