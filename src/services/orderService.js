const crypto = require("crypto");
const userService = require("./userService");
const storeService = require("./storeService");
const productService = require("./productService");
const NotFoundError = require("../domain/errors/notFoundError");
const ValidationError = require("../domain/errors/validationError");
const OrderItem = require("../domain/orderItem");
const Order = require("../domain/order");

const SUPPORTED_CATEGORIES = new Set([
  "grocery",
  "electronics",
  "household",
  "medicine",
]);

const CATEGORY_DISCOUNTS = {
  grocery: { threshold: 1000, rate: 0.05 },
  electronics: { threshold: 2000, rate: 0.1 },
};

const ELECTRONICS_MINIMUM = 500;

function round(value) {
  return Math.round(value * 100) / 100;
}

const orderService = {
  createOrder(request) {
    const user = this.requireUser(request.customerId);
    const store = this.requireStore(request.storeId);
    const orderItems = this.buildOrderItems(request.items, store);

    const categoryTotals = this.groupCategoryTotals(orderItems);
    this.validateElectronicsMinimum(categoryTotals);
    const discounts = this.buildCategoryDiscounts(categoryTotals);

    const finalPayableAmount = discounts.reduce(
      (sum, discount) => sum + discount.netCategoryTotal,
      0,
    );

    return new Order(
      "order_" + crypto.randomUUID(),
      user.userId,
      store.outletId,
      orderItems.map((item) => this.toResponseItem(item)),
      discounts.map((discount) => this.toResponseDiscount(discount)),
      round(finalPayableAmount),
    );
  },

  requireUser(customerId) {
    const user = userService.fetchUserById(customerId);
    if (!user) {
      throw new NotFoundError(`User '${customerId}' not found`);
    }
    return user;
  },

  requireStore(storeId) {
    const store = storeService.fetchStoreById(storeId);
    if (!store) {
      throw new NotFoundError(`Store '${storeId}' not found`);
    }
    return store;
  },

  buildOrderItems(items, store) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new ValidationError("items must be a non-empty array");
    }
    return items.map((item) => {
      const quantity = this.requirePositiveInteger(item.quantity);
      const product = productService.getProduct(item.productId, store.outletId);
      if (!product) {
        throw new NotFoundError(
          `Product '${item.productId}' not found in outlet '${store.outletId}'`,
        );
      }
      if (!SUPPORTED_CATEGORIES.has(product.category)) {
        throw new ValidationError(
          `category '${product.category}' is not supported`,
        );
      }
      return new OrderItem(product, quantity);
    });
  },

  requirePositiveInteger(quantity) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new ValidationError("quantity must be a positive integer");
    }
    return quantity;
  },

  groupCategoryTotals(orderItems) {
    const totals = new Map();
    orderItems.forEach((item) => {
      const current = totals.get(item.category) || 0;
      totals.set(item.category, current + item.netLineTotal);
    });
    return totals;
  },

  validateElectronicsMinimum(categoryTotals) {
    const electronicsTotal = categoryTotals.get("electronics");
    if (electronicsTotal !== undefined && electronicsTotal < ELECTRONICS_MINIMUM) {
      throw new ValidationError(
        `electronics order value must be at least ${ELECTRONICS_MINIMUM}`,
      );
    }
  },

  buildCategoryDiscounts(categoryTotals) {
    const discounts = [];
    categoryTotals.forEach((categoryTotal, category) => {
      const rule = CATEGORY_DISCOUNTS[category];
      const discountRate =
        rule && categoryTotal > rule.threshold ? rule.rate : 0;
      const discount = categoryTotal * discountRate;
      discounts.push({
        category,
        categoryTotal,
        discountRate,
        discount,
        netCategoryTotal: categoryTotal - discount,
      });
    });
    return discounts;
  },

  toResponseItem(item) {
    return {
      productId: item.product.productId,
      productName: item.product.productName,
      category: item.category,
      quantity: item.quantity,
      price: item.product.sellingPrice,
      lineTotal: round(item.lineTotal),
      productDiscount: round(item.productDiscount),
      netLineTotal: round(item.netLineTotal),
    };
  },

  toResponseDiscount(discount) {
    return {
      category: discount.category,
      categoryTotal: round(discount.categoryTotal),
      discountRate: discount.discountRate,
      discount: round(discount.discount),
      netCategoryTotal: round(discount.netCategoryTotal),
    };
  },
};

module.exports = orderService;
