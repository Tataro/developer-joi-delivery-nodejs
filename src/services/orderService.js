const userService = require("./userService");
const inventoryService = require("./inventoryService");
const Order = require("../domain/order");
const ValidationError = require("../domain/errors/validationError");
const NotFoundError = require("../domain/errors/notFoundError");

let orderSequence = 100;
const nextOrderId = () => `order${++orderSequence}`;

const round2 = (value) => Math.round(value * 100) / 100;

const orderService = {
  orders: new Map(),

  /**
   * Places an order: validates the request, reserves (decrements) stock for each
   * line, prices the order, and persists it. Quantity and stock handling live here
   * — the cart endpoints stay a simple selection list.
   *
   * @param {{userId: string, items: Array<{productId: string, outletId: string, quantity: number}>}} checkoutRequest
   * @returns {Order}
   */
  checkout(checkoutRequest) {
    if (
      !checkoutRequest ||
      !checkoutRequest.userId ||
      !Array.isArray(checkoutRequest.items) ||
      checkoutRequest.items.length === 0
    ) {
      throw new ValidationError(
        "userId and a non-empty items array are required in the request body",
      );
    }

    const user = userService.fetchUserById(checkoutRequest.userId);
    if (!user) {
      throw new NotFoundError(
        `User with id ${checkoutRequest.userId} not found`,
      );
    }

    // Reserve stock first — throws (ValidationError / NotFoundError /
    // InsufficientStockError) before any order is created if a line is invalid.
    const reserved = inventoryService.reserveStock(checkoutRequest.items);

    const items = reserved.map(({ product, quantity }) => ({
      productId: product.productId,
      productName: product.productName,
      quantity,
      unitPrice: product.sellingPrice,
      lineTotal: round2(product.sellingPrice * quantity),
    }));

    const totalAmount = round2(
      items.reduce((sum, item) => sum + item.lineTotal, 0),
    );

    const order = new Order(nextOrderId(), user.userId, items, totalAmount);
    this.orders.set(order.orderId, order);
    return order;
  },

  getOrderById(orderId) {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new NotFoundError(`Order with id ${orderId} not found`);
    }
    return order;
  },
};

module.exports = orderService;
