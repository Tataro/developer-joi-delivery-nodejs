const Outlet = require("./outlet");

class Store extends Outlet {
  constructor(name, description, outletId) {
    super(name, description, outletId);

    /** @type {Set<GroceryProduct>} */
    this.groceryProducts = new Set();

    /** @type {Set<MedicineProduct>} */
    this.medicineProducts = new Set();

    /** @type {Set<ElectronicProduct>} */
    this.electronicProducts = new Set();

    /** @type {Set<HouseholdProduct>} */
    this.householdProducts = new Set();

    /** @type {Set<GroceryProduct|MedicineProduct|ElectronicProduct|HouseholdProduct>} */
    this.inventory = new Set();
  }

  addGroceryProduct(product) {
    this.groceryProducts.add(product);
    this.inventory.add(product);
    return product;
  }

  addMedicineProduct(product) {
    this.medicineProducts.add(product);
    this.inventory.add(product);
    return product;
  }

  addElectronicProduct(product) {
    this.electronicProducts.add(product);
    this.inventory.add(product);
    return product;
  }

  addHouseholdProduct(product) {
    this.householdProducts.add(product);
    this.inventory.add(product);
    return product;
  }
}

module.exports = Store;
