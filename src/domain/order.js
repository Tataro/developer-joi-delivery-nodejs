class Order {
  /**
   * @param {string} orderId
   * @param {string} userId
   * @param {Array<{productId: string, productName: string, quantity: number, unitPrice: number, lineTotal: number}>} items
   * @param {number} totalAmount
   * @param {string} [status]
   */
  constructor(orderId, userId, items, totalAmount, status = "CONFIRMED") {
    /** @type {string} */
    this.orderId = orderId;

    /** @type {string} */
    this.userId = userId;

    /** @type {Array} */
    this.items = items;

    /** @type {number} */
    this.totalAmount = totalAmount;

    /** @type {string} */
    this.status = status;

    /** @type {string} */
    this.createdAt = new Date().toISOString();
  }
}

module.exports = Order;
