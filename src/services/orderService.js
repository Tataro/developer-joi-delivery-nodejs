const ValidationError = require("../domain/errors/validationError");
const NotFoundError = require("../domain/errors/notFoundError");
const cartService = require("./cartService");

const orderService = {
  createOrder: (params) => {
    const { customerId, storeId, products } = params;
    // validate input parameters -> throw ValidationError if invalid
    if (!customerId || !storeId || !products || products.length === 0) {
      throw new ValidationError("Invalid input parameters");
    }

    // fetch user cart and store inventory -> throw NotFoundError if not found
    const cart = cartService.getCartForUser(customerId);
    if (!cart) {
      throw new NotFoundError("Cart not found");
    }
    // cart = {
    //   cartId: "cart101",
    //   userId: "user101",
    //   products: [
    //     {
    //       product: {
    //         productId: "product101",
    //         productName: "Wheat Bread",
    //         category: "Grocery",
    //         sellingPrice: 10,

    //       },
    //       quantity: 2,
    //     },
    //     {
    //       product: {
    //         productId: "product102",
    //         productName: "Milk",
    //         category: "Electronic",
    //         sellingPrice: 10,
    //       },
    //       quantity: 1,
    //     },
    //   ],
    // }

    // find products in cart filtered by storeId, then group them by category and calculate total cost and discount based on category rules
    // TODO: improve this by checking with matching current price/quantity in store inventory to avoid price manipulation and ensure product availability before placing order
    const orderProducts = cart.products.filter(
      (item) => item.product.store.outletId === storeId,
    );

    const productsByCategory = {};
    orderProducts.forEach((item) => {
      const category = item.product.category;
      if (!productsByCategory[category]) {
        productsByCategory[category] = [];
      }
      productsByCategory[category].push({
        productId: item.product.productId,
        productName: item.product.productName,
        quantity: item.quantity,
        price: item.product.sellingPrice,
        category: item.product.category,
        totalPrice: item.product.sellingPrice * item.quantity,
      });
    });

    // calculate total cost and discount for each category
    let allProducts = [];
    let discount = 0,
      totalAmount = 0;
    Object.keys(productsByCategory).forEach((category) => {
      const products = productsByCategory[category];
      const { discount: categoryDiscount, totalAmount: categoryTotal } =
        orderService.calculateCost(products, category);
      discount += categoryDiscount;
      totalAmount += categoryTotal;
      allProducts = allProducts.concat(products);
    });

    // validate Electronic total amount should be above 500 to place order -> throw ValidationError if invalid
    const electronicTotal = allProducts
      .filter((p) => p.category === "Electronic")
      .reduce((sum, p) => sum + p.price * p.quantity, 0);
    if (electronicTotal > 0 && electronicTotal < 500) {
      throw new ValidationError(
        "Electronic total amount should be above 500 to place order",
      );
    }

    // create order object and return
    const orderResponse = {
      orderId: "order-" + Math.floor(Math.random() * 1000),
      customerId,
      storeId,
      products: allProducts,
      discount: discount,
      amount: totalAmount,
    };

    return orderResponse;
  },
  calculateCost: (products, category) => {
    // res { discount: 30, totalAmount: 480 }
    // Grocery orders above 1,000 → 5% discount.
    // Electronics orders above 2,000 → 10% discount

    let totalAmount = 0;
    let discount = 0;

    products.forEach((item) => {
      totalAmount += item.price * item.quantity;
    });

    if (totalAmount > 1000 && category === "Grocery") {
      discount = totalAmount * 0.05;
    }
    if (totalAmount > 2000 && category === "Electronic") {
      discount = totalAmount * 0.1;
    }

    return { discount, totalAmount: totalAmount - discount };
  },
};

module.exports = orderService;
