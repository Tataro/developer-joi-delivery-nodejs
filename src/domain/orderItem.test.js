const OrderItem = require("./orderItem");

describe("OrderItem", () => {
  const product = {
    productId: "electronic101",
    productName: "Wireless Earbuds",
    sellingPrice: 89.99,
    discount: 15,
    category: "electronics",
  };

  it("shouldComputeLineTotalAsQuantityTimesSellingPrice", () => {
    const item = new OrderItem(product, 7);
    expect(item.lineTotal).toBeCloseTo(629.93, 5);
  });

  it("shouldComputeProductDiscountFromTheProductDiscountPercent", () => {
    const item = new OrderItem(product, 7);
    expect(item.productDiscount).toBeCloseTo(94.4895, 5);
  });

  it("shouldComputeNetLineTotalAsLineTotalMinusProductDiscount", () => {
    const item = new OrderItem(product, 7);
    expect(item.netLineTotal).toBeCloseTo(535.4405, 5);
  });

  it("shouldTreatAMissingDiscountAsZero", () => {
    const item = new OrderItem({ sellingPrice: 10, category: "grocery" }, 3);
    expect(item.productDiscount).toBe(0);
    expect(item.netLineTotal).toBe(30);
  });

  it("shouldExposeTheProductCategory", () => {
    const item = new OrderItem(product, 1);
    expect(item.category).toBe("electronics");
  });
});
