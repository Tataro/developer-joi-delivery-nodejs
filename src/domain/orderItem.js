class OrderItem {
  /**
   * @param {Product & { sellingPrice: number, discount?: number, category: string }} product
   * @param {number} quantity
   */
  constructor(product, quantity) {
    /** @type {object} */
    this.product = product;
    /** @type {number} */
    this.quantity = quantity;
  }

  get lineTotal() {
    return this.quantity * this.product.sellingPrice;
  }

  get productDiscount() {
    const rate = (this.product.discount || 0) / 100;
    return this.lineTotal * rate;
  }

  get netLineTotal() {
    return this.lineTotal - this.productDiscount;
  }

  get category() {
    return this.product.category;
  }
}

module.exports = OrderItem;
