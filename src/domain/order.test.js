const Order = require("./order");

describe("Order", () => {
  it("shouldHoldTheOrderFieldsAndSerializeToJson", () => {
    const items = [{ productId: "electronic101", lineTotal: 629.93 }];
    const discounts = [{ category: "electronics", discount: 0 }];
    const order = new Order(
      "order_abc",
      "user101",
      "store102",
      items,
      discounts,
      535.44,
    );

    expect(order.orderId).toBe("order_abc");
    expect(order.customerId).toBe("user101");
    expect(order.storeId).toBe("store102");
    expect(order.items).toBe(items);
    expect(order.discounts).toBe(discounts);
    expect(order.finalPayableAmount).toBe(535.44);

    const serialized = JSON.parse(JSON.stringify(order));
    expect(serialized.finalPayableAmount).toBe(535.44);
    expect(serialized.items[0].lineTotal).toBe(629.93);
  });
});
