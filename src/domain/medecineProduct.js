const Product = require("./product");

class MedecineProduct extends Product {
  /**
   * @param {number} sellingPrice
   * @param {Store} store
   * @param {boolean} [available]
   */
  constructor(
    productId,
    productName,
    mrp,
    sellingPrice,
    store,
    available = true,
  ) {
    super(productId, productName, mrp);
    /** @type {number} */
    this.sellingPrice = sellingPrice;
    /** @type {Store} */
    this.store = store;
    /** @type {boolean} */
    this.available = available;
    this.category = "Medecine";
  }
}

module.exports = MedecineProduct;
