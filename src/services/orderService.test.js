const orderService = require("./orderService");
const ValidationError = require("../domain/errors/validationError");
const cartService = require("./cartService");

jest.mock("./cartService", () => ({
  getCartForUser: jest.fn(),
}));

describe("orderService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create an order successfully", () => {
    cartService.getCartForUser.mockReturnValue({
      cartId: "cart101",
      userId: "user101",
      products: [
        {
          product: {
            productId: "product101",
            productName: "Electronic",
            sellingPrice: 500,
            category: "Electronic",
            store: {
              outletId: "store101",
            },
          },
          quantity: 2,
        },
        {
          product: {
            productId: "product102",
            productName: "Medicine",
            sellingPrice: 10,
            category: "Medicine",
            store: {
              outletId: "store101",
            },
          },
          quantity: 1,
        },
      ],
    });

    const mockParams = {
      customerId: "user101",
      storeId: "store101",
      products: [
        {
          productId: "product101",
          quantity: 2,
          price: 500,
        },
        {
          productId: "product102",
          quantity: 1,
          price: 10,
        },
      ],
    };
    const result = orderService.createOrder(mockParams);
    // {
    //   orderId: 'order-502',
    //   customerId: 'user101',
    //   storeId: 'store101',
    //   products: [
    //     {
    //       productId: 'product101',
    //       productName: 'Electronic',
    //       quantity: 2,
    //       price: 500,
    //       category: 'Electronic',
    //       totalPrice: 1000
    //     },
    //     {
    //       productId: 'product102',
    //       productName: 'Medicine',
    //       quantity: 1,
    //       price: 10,
    //       category: 'Medicine',
    //       totalPrice: 10
    //     }
    //   ],
    //   discount: 0,
    //   amount: 1010
    // }

    expect(result).toHaveProperty("orderId");
    expect(result).toHaveProperty("customerId", "user101");
    expect(result).toHaveProperty("storeId", "store101");
    expect(result).toHaveProperty("products");
    expect(result.products).toHaveLength(2);
    expect(result.products[0]).toHaveProperty("productId", "product101");
    expect(result.products[0]).toHaveProperty("quantity", 2);
    expect(result.products[0]).toHaveProperty("price", 500);
    expect(result.products[0]).toHaveProperty("totalPrice", 1000);
    expect(result.products[0]).toHaveProperty("category", "Electronic");
    expect(result.products[1]).toHaveProperty("productId", "product102");
    expect(result.products[1]).toHaveProperty("quantity", 1);
    expect(result.products[1]).toHaveProperty("price", 10);
    expect(result.products[1]).toHaveProperty("totalPrice", 10);
    expect(result.products[1]).toHaveProperty("category", "Medicine");
    expect(result).toHaveProperty("discount", 0);
    expect(result).toHaveProperty("amount", 1010);
  });

  it("should apply discount rules correctly", () => {
    cartService.getCartForUser.mockReturnValue({
      cartId: "cart101",
      userId: "user101",
      products: [
        {
          product: {
            productId: "product201",
            productName: "Electronic1",
            sellingPrice: 3000,
            category: "Electronic",
            store: {
              outletId: "store101",
            },
          },
          quantity: 2,
        },
        {
          product: {
            productId: "product202",
            productName: "Electronic2",
            sellingPrice: 1000,
            category: "Electronic",
            store: {
              outletId: "store101",
            },
          },
          quantity: 1,
        },
        {
          product: {
            productId: "product203",
            productName: "Grocery1",
            sellingPrice: 2000,
            category: "Grocery",
            store: {
              outletId: "store101",
            },
          },
          quantity: 1,
        },
      ],
    });

    const mockParams = {
      customerId: "user101",
      storeId: "store101",
      products: [
        {
          productId: "product201",
          quantity: 2,
          price: 3000,
        },
        {
          productId: "product202",
          quantity: 1,
          price: 1000,
        },
        {
          productId: "product203",
          quantity: 1,
          price: 2000,
        },
      ],
    };
    const result = orderService.createOrder(mockParams);

    expect(result).toHaveProperty("discount", 800);
    expect(result).toHaveProperty("amount", 8200);
  });

  it("should throw an error when trying to create an order with an empty cart", () => {
    const mockParams = {
      customerId: "user101",
      storeId: "store101",
      products: [],
    };

    expect(() => orderService.createOrder(mockParams)).toThrow(ValidationError);
  });

  it("should throw an error when trying to create an order with electronic products total amount less than 500", () => {
    cartService.getCartForUser.mockReturnValue({
      cartId: "cart101",
      userId: "user101",
      products: [
        {
          product: {
            productId: "product301",
            productName: "Electronic",
            sellingPrice: 400,
            category: "Electronic",
            store: {
              outletId: "store101",
            },
          },
          quantity: 1,
        },
      ],
    });
    const mockParams = {
      customerId: "user101",
      storeId: "store101",
      products: [
        {
          productId: "product301",
          quantity: 1,
          price: 400,
        },
      ],
    };

    expect(() => orderService.createOrder(mockParams)).toThrow(ValidationError);
  });
});
