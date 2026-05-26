const Outlet = require("./outlet");

class Restaurant extends Outlet {
  /**
   * A food outlet. Parallel to GroceryStore: it owns a collection of sellable
   * items (here a `menu` of FoodProducts, like GroceryStore's `inventory`).
   *
   * @param {string} cuisineType
   */
  constructor(name, description, outletId, cuisineType) {
    super(name, description, outletId);
    /** @type {Set<FoodProduct>} */
    this.menu = new Set();
    /** @type {string} */
    this.cuisineType = cuisineType;
  }
}

module.exports = Restaurant;
