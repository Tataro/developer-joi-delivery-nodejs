const Product = require("./product");

class FoodProduct extends Product {
  /**
   * A menu item sold by a Restaurant. Unlike GroceryProduct, food is made to
   * order, so it tracks availability and preparation time rather than weight,
   * expiry, and a counted stock level.
   *
   * @param {number} sellingPrice
   * @param {number} preparationTime - estimated prep time in minutes
   * @param {boolean} isVegetarian
   * @param {boolean} isAvailable - made-to-order: available vs not, not a count
   * @param {Restaurant} restaurant
   * @param {string[]} [customizations]
   * @param {number} [discount]
   */
  constructor(
    productId,
    productName,
    mrp,
    sellingPrice,
    preparationTime,
    isVegetarian,
    isAvailable,
    restaurant,
    customizations = [],
    discount = 0,
  ) {
    super(productId, productName, mrp);
    /** @type {number} */
    this.sellingPrice = sellingPrice;
    /** @type {number} */
    this.preparationTime = preparationTime;
    /** @type {boolean} */
    this.isVegetarian = isVegetarian;
    /** @type {boolean} */
    this.isAvailable = isAvailable;
    /** @type {Restaurant} */
    this.restaurant = restaurant;
    /** @type {string[]} */
    this.customizations = customizations;
    /** @type {number} */
    this.discount = discount;
  }
}

module.exports = FoodProduct;
