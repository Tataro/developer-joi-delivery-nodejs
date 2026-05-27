const Outlet = require("./outlet");

class Restaurant extends Outlet {
  /**
   * @param {Set<FoodProduct>} menu
   */
  constructor(name, description, outletId) {
    super(name, description, outletId);
    /** @type {Set<FoodProduct>} */
    this.menu = new Set();
  }
}

module.exports = Restaurant;
