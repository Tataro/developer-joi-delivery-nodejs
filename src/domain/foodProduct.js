const Product = require("./product");

class FoodProduct extends Product {
  /**
   * @param {number} sellingPrice
   * @param {boolean} isVeg
   * @param {number} prepTimeMins
   * @param {number} availableStock
   * @param {Restaurant} restaurant
   * @param {number} [discount]
   */
  constructor(
    productId,
    productName,
    mrp,
    sellingPrice,
    isVeg,
    prepTimeMins,
    availableStock,
    restaurant,
    discount = 0
  ) {
    super(productId, productName, mrp);
    /** @type {number} */
    this.sellingPrice = sellingPrice;
    /** @type {boolean} */
    this.isVeg = isVeg;
    /** @type {number} */
    this.prepTimeMins = prepTimeMins;
    /** @type {number} */
    this.availableStock = availableStock;
    /** @type {Restaurant} */
    this.restaurant = restaurant;
    /** @type {number} */
    this.discount = discount;
  }
}

module.exports = FoodProduct;
