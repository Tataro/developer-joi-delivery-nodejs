const orderService = require("./orderService");
const productService = require("./productService");
const NotFoundError = require("../domain/errors/notFoundError");
const ValidationError = require("../domain/errors/validationError");

describe("orderService.createOrder", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("happy paths", () => {
    it("shouldApplyGroceryCategoryDiscountAboveOneThousand", () => {
      const order = orderService.createOrder({
        customerId: "user101",
        storeId: "store101",
        items: [{ productId: "product101", quantity: 200 }],
      });

      expect(order.customerId).toBe("user101");
      expect(order.storeId).toBe("store101");
      expect(order.items[0]).toMatchObject({
        productId: "product101",
        category: "grocery",
        quantity: 200,
        price: 9.99,
        lineTotal: 1998,
        productDiscount: 0,
        netLineTotal: 1998,
      });
      expect(order.discounts[0]).toMatchObject({
        category: "grocery",
        categoryTotal: 1998,
        discountRate: 0.05,
        discount: 99.9,
        netCategoryTotal: 1898.1,
      });
      expect(order.finalPayableAmount).toBe(1898.1);
    });

    it("shouldNotApplyGroceryDiscountAtOrBelowOneThousand", () => {
      const order = orderService.createOrder({
        customerId: "user101",
        storeId: "store101",
        items: [{ productId: "product101", quantity: 100 }],
      });

      expect(order.discounts[0].discountRate).toBe(0);
      expect(order.finalPayableAmount).toBe(999);
    });

    it("shouldApplyPerProductDiscountThenPassElectronicsGate", () => {
      const order = orderService.createOrder({
        customerId: "user101",
        storeId: "store102",
        items: [{ productId: "electronic101", quantity: 7 }],
      });

      expect(order.items[0]).toMatchObject({
        category: "electronics",
        lineTotal: 629.93,
        productDiscount: 94.49,
        netLineTotal: 535.44,
      });
      expect(order.discounts[0].discountRate).toBe(0);
      expect(order.finalPayableAmount).toBe(535.44);
    });

    it("shouldApplyElectronicsCategoryDiscountAboveTwoThousand", () => {
      const order = orderService.createOrder({
        customerId: "user101",
        storeId: "store102",
        items: [{ productId: "electronic102", quantity: 30 }],
      });

      expect(order.discounts[0]).toMatchObject({
        category: "electronics",
        categoryTotal: 2699.7,
        discountRate: 0.1,
        discount: 269.97,
        netCategoryTotal: 2429.73,
      });
      expect(order.finalPayableAmount).toBe(2429.73);
    });

    it("shouldSumMultipleCategoriesWithNoCategoryDiscount", () => {
      const order = orderService.createOrder({
        customerId: "user101",
        storeId: "store102",
        items: [
          { productId: "household101", quantity: 2 },
          { productId: "medicine101", quantity: 1 },
        ],
      });

      const categories = order.discounts.map((d) => d.category).sort();
      expect(categories).toEqual(["household", "medicine"]);
      expect(order.finalPayableAmount).toBe(40.37);
    });

    it("shouldGenerateAUniqueOrderIdEachTime", () => {
      const request = {
        customerId: "user101",
        storeId: "store101",
        items: [{ productId: "product101", quantity: 1 }],
      };
      const first = orderService.createOrder(request);
      const second = orderService.createOrder(request);

      expect(first.orderId).toMatch(/^order_/);
      expect(first.orderId).not.toBe(second.orderId);
    });
  });

  describe("boundaries (synthetic products)", () => {
    function stubElectronics(sellingPrice) {
      jest.spyOn(productService, "getProduct").mockReturnValue({
        productId: "synthetic",
        productName: "Synthetic Electronics",
        sellingPrice,
        discount: 0,
        category: "electronics",
      });
    }

    it("shouldAcceptElectronicsExactlyAtFiveHundred", () => {
      stubElectronics(250); // 250 x 2 = 500
      const order = orderService.createOrder({
        customerId: "user101",
        storeId: "store102",
        items: [{ productId: "synthetic", quantity: 2 }],
      });
      expect(order.finalPayableAmount).toBe(500);
    });

    it("shouldNotDiscountElectronicsExactlyAtTwoThousand", () => {
      stubElectronics(1000); // 1000 x 2 = 2000, not > 2000
      const order = orderService.createOrder({
        customerId: "user101",
        storeId: "store102",
        items: [{ productId: "synthetic", quantity: 2 }],
      });
      expect(order.discounts[0].discountRate).toBe(0);
      expect(order.finalPayableAmount).toBe(2000);
    });
  });

  describe("validation", () => {
    it("shouldRejectWhenCustomerDoesNotExist", () => {
      expect(() =>
        orderService.createOrder({
          customerId: "ghost",
          storeId: "store101",
          items: [{ productId: "product101", quantity: 1 }],
        }),
      ).toThrow(NotFoundError);
    });

    it("shouldRejectWhenStoreDoesNotExist", () => {
      expect(() =>
        orderService.createOrder({
          customerId: "user101",
          storeId: "ghost",
          items: [{ productId: "product101", quantity: 1 }],
        }),
      ).toThrow(NotFoundError);
    });

    it("shouldRejectWhenItemsIsEmpty", () => {
      expect(() =>
        orderService.createOrder({
          customerId: "user101",
          storeId: "store101",
          items: [],
        }),
      ).toThrow(ValidationError);
    });

    it.each([0, -2, 1.5])(
      "shouldRejectInvalidQuantity %p",
      (quantity) => {
        expect(() =>
          orderService.createOrder({
            customerId: "user101",
            storeId: "store101",
            items: [{ productId: "product101", quantity }],
          }),
        ).toThrow(ValidationError);
      },
    );

    it("shouldRejectWhenProductIsNotInTheStore", () => {
      expect(() =>
        orderService.createOrder({
          customerId: "user101",
          storeId: "store101",
          items: [{ productId: "ghost", quantity: 1 }],
        }),
      ).toThrow(NotFoundError);
    });

    it("shouldRejectAnUnsupportedCategory", () => {
      jest.spyOn(productService, "getProduct").mockReturnValue({
        productId: "food101",
        productName: "Margherita Pizza",
        sellingPrice: 10.99,
        discount: 0,
        category: "food",
      });
      expect(() =>
        orderService.createOrder({
          customerId: "user101",
          storeId: "store102",
          items: [{ productId: "food101", quantity: 1 }],
        }),
      ).toThrow(ValidationError);
    });

    it("shouldRejectElectronicsBelowFiveHundred", () => {
      expect(() =>
        orderService.createOrder({
          customerId: "user101",
          storeId: "store102",
          items: [{ productId: "electronic101", quantity: 1 }],
        }),
      ).toThrow(ValidationError);
    });
  });
});
