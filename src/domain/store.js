const outlet = require("./outlet");

class Store extends outlet {
  /**
   * @param {Set<GroceryProduct | HouseholdProduct | MedecineProduct | EletronicProduct>} inventory
   */

  constructor(name, description, outletId) {
    super(name, description, outletId);
    /** @type {Set<GroceryProduct | HouseholdProduct | MedecineProduct | EletronicProduct>} */
    this.inventory = new Set();
  }
}

module.exports = Store;
