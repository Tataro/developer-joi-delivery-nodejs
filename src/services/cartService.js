const userService = require("./userService");
const productService = require("./productService");
const ValidationError = require("../domain/errors/validationError");
const NotFoundError = require("../domain/errors/notFoundError");
const InsufficientStockError = require("../domain/errors/insufficientStockError");

const cartService = {
  userCarts: new Map(),

  addProductToCartForUser(addProductRequest) {
    if (!addProductRequest) {
      throw new ValidationError("Request body is required");
    }

    const { userId, productId, outletId } = addProductRequest;
    if (!userId) {
      throw new ValidationError("userId is required");
    }
    if (!productId) {
      throw new ValidationError("productId is required");
    }
    if (!outletId) {
      throw new ValidationError("outletId is required");
    }

    const quantity =
      addProductRequest.quantity === undefined ? 1 : addProductRequest.quantity;
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new ValidationError("quantity must be a positive integer");
    }

    const user = userService.fetchUserById(userId);
    if (!user) {
      throw new NotFoundError(`User '${userId}' not found`);
    }

    const cart = this.fetchCartForUser(user);
    if (!cart) {
      throw new NotFoundError(`Cart for user '${userId}' not found`);
    }

    const product = productService.getProduct(productId, outletId);
    if (!product) {
      throw new NotFoundError(
        `Product '${productId}' not found in outlet '${outletId}'`
      );
    }

    if (quantity > product.availableStock) {
      throw new InsufficientStockError(
        `Only ${product.availableStock} unit(s) of '${productId}' available`
      );
    }

    // Reserve the stock and merge into the existing line item, if any.
    product.availableStock -= quantity;

    let lineItem = cart.products.find(
      (item) => item.product.productId === product.productId
    );
    if (lineItem) {
      lineItem.quantity += quantity;
    } else {
      lineItem = { product, quantity };
      cart.products.push(lineItem);
    }

    return {
      cart: cart,
      product: product,
      quantity: lineItem.quantity,
      sellingPrice: product.sellingPrice,
    };
  },

  getCartForUser(userId) {
    if (!userId) {
      throw new ValidationError("userId is required");
    }

    const user = userService.fetchUserById(userId);
    if (!user) {
      throw new NotFoundError(`User '${userId}' not found`);
    }

    const cart = this.fetchCartForUser(user);
    if (!cart) {
      throw new NotFoundError(`Cart for user '${userId}' not found`);
    }

    return cart;
  },

  fetchCartForUser(user) {
    return this.userCarts.get(user.userId);
  },
};

module.exports = cartService;
