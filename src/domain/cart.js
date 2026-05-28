class Cart {
  /**
   * @param {string} cartId
   * @param {Outlet} outlet
   * @param {User} user
   */
  constructor(cartId, outlet, user) {
    /** @type {string} */
    this.cartId = cartId;

    /** @type {Outlet} */
    this.outlet = outlet;

    /** @type {Array<CartItem>} */
    this.products = [];

    /** @type {User} */
    this.user = user;
  }
}

module.exports = Cart;
