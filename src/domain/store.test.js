const Outlet = require("./outlet");
const Store = require("./store");

describe("Store", () => {
  it("shouldBeAnOutletWithInventoriesForEachSupportedCategory", () => {
    const store = new Store(
      "JOI Market",
      "One-stop essentials store",
      "store999",
    );

    expect(store).toBeInstanceOf(Outlet);
    expect(store.name).toBe("JOI Market");
    expect(store.description).toBe("One-stop essentials store");
    expect(store.outletId).toBe("store999");
    expect(store.groceryProducts).toBeInstanceOf(Set);
    expect(store.medicineProducts).toBeInstanceOf(Set);
    expect(store.electronicProducts).toBeInstanceOf(Set);
    expect(store.householdProducts).toBeInstanceOf(Set);
    expect(store.inventory).toBeInstanceOf(Set);
  });

  it("shouldTrackProductsInTheirCategoryAndCombinedInventory", () => {
    const store = new Store(
      "JOI Market",
      "One-stop essentials store",
      "store999",
    );
    const grocery = { productId: "grocery101" };
    const medicine = { productId: "medicine101" };
    const electronic = { productId: "electronic101" };
    const household = { productId: "household101" };

    store.addGroceryProduct(grocery);
    store.addMedicineProduct(medicine);
    store.addElectronicProduct(electronic);
    store.addHouseholdProduct(household);

    expect(store.groceryProducts.has(grocery)).toBe(true);
    expect(store.medicineProducts.has(medicine)).toBe(true);
    expect(store.electronicProducts.has(electronic)).toBe(true);
    expect(store.householdProducts.has(household)).toBe(true);
    expect(store.inventory).toEqual(
      new Set([grocery, medicine, electronic, household]),
    );
  });
});
