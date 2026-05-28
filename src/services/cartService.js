const userService = require("./userService");
const productService = require("./productService");
const ValidationError = require("../domain/errors/validationError");
const NotFoundError = require("../domain/errors/notFoundError");
const InsufficientStockError = require("../domain/errors/insufficientStockError");

const cartService = {
  userCarts: new Map(),

  addProductToCartForUser(addProductRequest) {
    if (!addProductRequest) throw new ValidationError("Request is required");
    if (!addProductRequest.userId) throw new ValidationError("userId is required");
    if (!addProductRequest.productId) throw new ValidationError("productId is required");
    if (!addProductRequest.outletId) throw new ValidationError("outletId is required");

    const quantity = addProductRequest.quantity === undefined ? 1 : addProductRequest.quantity;
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new ValidationError("quantity must be a positive integer");
    }

    const user = userService.fetchUserById(addProductRequest.userId);
    if (!user) throw new NotFoundError("User not found");

    const cart = this.userCarts.get(user.userId);
    if (!cart) throw new NotFoundError("Cart not found");

    const product = productService.getProduct(addProductRequest.productId, addProductRequest.outletId);
    if (!product) throw new NotFoundError("Product not found");

    if (quantity > product.availableStock) {
      throw new InsufficientStockError("Insufficient stock");
    }

    product.availableStock -= quantity;

    let lineItem = cart.products.find((item) => item.product.productId === product.productId);
    if (lineItem) {
      lineItem.quantity += quantity;
    } else {
      lineItem = { product, quantity };
      cart.products.push(lineItem);
    }

    return { cart, product, quantity: lineItem.quantity, sellingPrice: product.sellingPrice };
  },

  getCartForUser(userId) {
    if (!userId) throw new ValidationError("userId is required");

    const user = userService.fetchUserById(userId);
    if (!user) throw new NotFoundError("User not found");

    const cart = this.userCarts.get(user.userId);
    if (!cart) throw new NotFoundError("Cart not found");

    return cart;
  },
};

module.exports = cartService;
