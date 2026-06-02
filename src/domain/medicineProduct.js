const product = require("./product");

class MedicineProduct extends product {
  /**
   * @param {number} sellingPrice
   * @param {string} expiryDate
   * @param {number} availableStock
   * @param {Store} store
   * @param {number} [discount]
   */

  constructor(
    productId,
    productName,
    mrp,
    sellingPrice,
    expiryDate,
    availableStock,
    store,
    discount = 0,
  ) {
    super(productId, productName, mrp);
    /** @type {number} */
    this.sellingPrice = sellingPrice;
    /** @type {string} */
    this.expiryDate = expiryDate;
    /** @type {number} */
    this.availableStock = availableStock;
    /** @type {Store} */
    this.store = store;
    /** @type {number} */
    this.discount = discount;
  }

  get category() {
    return "medicine";
  }
}

module.exports = MedicineProduct;
