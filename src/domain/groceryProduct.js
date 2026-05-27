const Product = require("./product");

class GroceryProduct extends Product {
  /**
   * @param {number} sellingPrice
   * @param {number} weight
   * @param {string} expiryDate
   * @param {number} threshold
   * @param {number} availableStock
   * @param {GroceryStore} store
   * @param {number} [discount]
   */

  constructor(
    productId,
    productName,
    mrp,
    sellingPrice,
    weight,
    expiryDate,
    threshold,
    availableStock,
    store,
    discount = 0,
  ) {
    super(productId, productName, mrp);
    /** @type {number} */
    this.sellingPrice = sellingPrice;
    /** @type {number} */
    this.weight = weight;
    /** @type {string} */
    this.expiryDate = expiryDate;
    /** @type {number} */
    this.threshold = threshold;
    /** @type {number} */
    this.availableStock = availableStock;
    /** @type {GroceryStore} */
    this.store = store;
    /** @type {number} */
    this.discount = discount;
  }
}

module.exports = GroceryProduct;
