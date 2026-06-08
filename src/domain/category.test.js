const SeedData = require("../seedData/seedData");

describe("product category getter", () => {
  it("shouldReportGroceryForGroceryProducts", () => {
    expect(SeedData.groceryProducts[0].category).toBe("grocery");
  });

  it("shouldReportElectronicsForElectronicsProducts", () => {
    expect(SeedData.electronicProducts[0].category).toBe("electronics");
  });

  it("shouldReportHouseholdForHouseholdProducts", () => {
    expect(SeedData.householdProducts[0].category).toBe("household");
  });

  it("shouldReportMedicineForMedicineProducts", () => {
    expect(SeedData.medicineProducts[0].category).toBe("medicine");
  });

  it("shouldReportFoodForFoodProducts", () => {
    expect(SeedData.foodProducts[0].category).toBe("food");
  });
});
