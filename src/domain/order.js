class Order {
  /**
   * @param {string} orderId
   * @param {string} customerId
   * @param {string} storeId
   * @param {object[]} items
   * @param {object[]} discounts
   * @param {number} finalPayableAmount
   */
  constructor(orderId, customerId, storeId, items, discounts, finalPayableAmount) {
    /** @type {string} */
    this.orderId = orderId;
    /** @type {string} */
    this.customerId = customerId;
    /** @type {string} */
    this.storeId = storeId;
    /** @type {object[]} */
    this.items = items;
    /** @type {object[]} */
    this.discounts = discounts;
    /** @type {number} */
    this.finalPayableAmount = finalPayableAmount;
  }
}

module.exports = Order;
