const Cart = require("../domain/cart");
const GroceryStore = require("../domain/groceryStore");
const User = require("../domain/user");
const GroceryProduct = require("../domain/groceryProduct");

class SeedData {
  static createCartForUser(user, cartId) {
    return new Cart(cartId, SeedData.store101, user);
  }

  static createStore(outletName, storeId) {
    return new GroceryStore(outletName, "Premium grocery store", storeId);
  }

  static createUser(userId, firstName, lastName) {
    const email =
      firstName.toLowerCase() + "." + lastName.toLowerCase() + "@gmail.com";
    const phoneNumber = SeedData.getRandomNumberUsingNextInt(
      100000000,
      900000000,
    ).toString();
    return new User(
      userId,
      firstName.toLowerCase(),
      firstName,
      lastName,
      email,
      phoneNumber,
      null,
    );
  }

  static getRandomNumberUsingNextInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  static createGroceryProduct(productName, productId, store) {
    return new GroceryProduct(
      productId,
      productName,
      10.5, // mrp
      9.99, // sellingPrice
      0.5, // weight in kg
      7, // expiryDate in days
      10, // threshold
      30, // availableStock
      store, // store reference
    );
  }
}

SeedData.store101 = SeedData.createStore("Fresh Picks", "store101");
SeedData.store102 = SeedData.createStore("Natural Choice", "store102");
SeedData.user101 = SeedData.createUser("user101", "John", "Doe");
SeedData.user102 = SeedData.createUser("user102", "Rachel", "Zane");

SeedData.cartForUsers = new Map([
  ["user101", SeedData.createCartForUser(SeedData.user101, "cart101")],
  ["user102", SeedData.createCartForUser(SeedData.user102, "cart102")],
]);

SeedData.groceryProducts = [
  SeedData.createGroceryProduct("Wheat Bread", "product101", SeedData.store101),
  SeedData.createGroceryProduct("Spinach", "product102", SeedData.store101),
  SeedData.createGroceryProduct("Crackers", "product103", SeedData.store101),
];

SeedData.users = [SeedData.user101, SeedData.user102];

module.exports = SeedData;
