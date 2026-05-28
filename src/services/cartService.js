const userService = require("./userService");
const productService = require("./productService");
const NotFoundError = require("../domain/errors/notFoundError");
const ValidationError = require("../domain/errors/validationError");
const CartItem = require("../domain/cartItem");

const cartService = {
  userCarts: new Map(),

  addProductToCartForUser(addProductRequest) {
    const quantity = this.normalizeQuantity(addProductRequest.quantity);
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
    this.addLineItem(cart, product, quantity);
    return {
      cart: cart,
      product: product,
      sellingPrice: product.sellingPrice,
    };
  },

  normalizeQuantity(quantity) {
    if (quantity === undefined || quantity === null) {
      return 1;
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new ValidationError("quantity must be a positive integer");
    }
    return quantity;
  },

  addLineItem(cart, product, quantity) {
    const existing = cart.products.find(
      (item) => item.product.productId === product.productId,
    );
    if (existing) {
      existing.quantity += quantity;
      return existing;
    }
    const lineItem = new CartItem(product, quantity);
    cart.products.push(lineItem);
    return lineItem;
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
