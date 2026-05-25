const userService = require("./userService");
const productService = require("./productService");
const ValidationError = require("../domain/errors/validationError");
const NotFoundError = require("../domain/errors/notFoundError");

const cartService = {
  userCarts: new Map(),

  addProductToCartForUser(addProductRequest) {
    // validate request
    if (
      !addProductRequest ||
      !addProductRequest.userId ||
      !addProductRequest.productId ||
      !addProductRequest.outletId
    ) {
      throw new ValidationError(
        "userId, productId and outletId are required in the request body",
      );
    }

    const user = userService.fetchUserById(addProductRequest.userId);

    if (!user) {
      throw new NotFoundError(
        `User with id ${addProductRequest.userId} not found`,
      );
    }

    const cart = this.fetchCartForUser(user);
    const product = productService.getProduct(
      addProductRequest.productId,
      addProductRequest.outletId,
    );

    if (!product) {
      throw new NotFoundError(
        `Product with id ${addProductRequest.productId} not found in store with id ${addProductRequest.outletId}`,
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
    const user = userService.fetchUserById(userId);
    if (!user) {
      throw new NotFoundError(`User with id ${userId} not found`);
    }

    return this.fetchCartForUser(user);
  },

  fetchCartForUser(user) {
    return this.userCarts.get(user.userId);
  },
};

module.exports = cartService;
