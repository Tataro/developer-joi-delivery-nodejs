const userService = require("./userService");
const productService = require("./productService");
const NotFoundError = require("../domain/errors/notFoundError");

const cartService = {
  userCarts: new Map(),

  addProductToCartForUser(addProductRequest) {
    const user = this.requireUser(addProductRequest.userId);

    const cart = this.fetchCartForUser(user);
    const product = productService.getProduct(
      addProductRequest.productId,
      addProductRequest.outletId,
    );
    if (!product) {
      throw new NotFoundError(
        `Product '${addProductRequest.productId}' not found in outlet '${addProductRequest.outletId}'`,
      );
    }
    cart.products.push(product);
    return {
      cart: cart,
      product: product,
      sellingPrice: product.sellingPrice,
    };
  },

  getCartForUser(userId) {
    const user = this.requireUser(userId);
    return this.fetchCartForUser(user);
  },

  requireUser(userId) {
    const user = userService.fetchUserById(userId);
    if (!user) {
      throw new NotFoundError(`User '${userId}' not found`);
    }
    return user;
  },

  fetchCartForUser(user) {
    return this.userCarts.get(user.userId);
  },
};

module.exports = cartService;
