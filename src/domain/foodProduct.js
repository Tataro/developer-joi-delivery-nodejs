const Product = require("./product");

class FoodProduct extends Product {
  /**
   * @param {number} sellingPrice
   * @param {Restaurant} restaurant
   * @param {boolean} [available]
   */
  constructor(productId, productName, mrp, sellingPrice, restaurant, available = true) {
    super(productId, productName, mrp);
    /** @type {number} */
    this.sellingPrice = sellingPrice;
    /** @type {Restaurant} */
    this.restaurant = restaurant;
    /** @type {boolean} */
    this.available = available;
  }
}

module.exports = FoodProduct;
