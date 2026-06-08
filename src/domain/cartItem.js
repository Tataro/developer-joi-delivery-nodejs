class CartItem {
  /**
   * @param {Product} product
   * @param {number} quantity
   */
  constructor(product, quantity) {
    /** @type {Product} */
    this.product = product;

    /** @type {number} */
    this.quantity = quantity;
  }
}

module.exports = CartItem;
