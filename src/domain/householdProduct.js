const product = require("./product");

const HouseholdProduct = class extends product {
  /**
   * @param {number} sellingPrice
   * @param {number} availableStock
   * @param {Store} store
   * @param {number} [discount]
   * */
  constructor(
    productId,
    productName,
    mrp,
    sellingPrice,
    availableStock,
    store,
    discount = 0,
  ) {
    super(productId, productName, mrp);
    /** @type {number} */
    this.sellingPrice = sellingPrice;
    /** @type {number} */
    this.availableStock = availableStock;
    /** @type {Store} */
    this.store = store;
    /** @type {number} */
    this.discount = discount;
  }

  get category() {
    return "household";
  }
};

module.exports = HouseholdProduct;
