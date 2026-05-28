const Cart = require("../domain/cart");
const GroceryStore = require("../domain/groceryStore");
const Restaurant = require("../domain/restaurant");
const User = require("../domain/user");
const GroceryProduct = require("../domain/groceryProduct");
const FoodProduct = require("../domain/foodProduct");

class SeedData {
  static createCartForUser(cartId, user) {
    return new Cart(cartId, null, user);
  }

  static createStore(outletName, storeId) {
    return new GroceryStore(outletName, "Premium grocery store", storeId);
  }

  static createRestaurant(name, outletId) {
    return new Restaurant(name, "Local restaurant", outletId);
  }

  static createUser(userId, firstName, lastName) {
    const email = firstName + "." + lastName + "@gmail.com";
    const phoneNumber = SeedData.getRandomNumberUsingNextInt(
      100000000,
      900000000
    ).toString();
    return new User(
      userId,
      firstName.toLowerCase(),
      firstName,
      lastName,
      email,
      phoneNumber,
      null
    );
  }

  static getRandomNumberUsingNextInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  static createGroceryProduct(productName, productId, store) {
    return new GroceryProduct(
      productId,
      productName,
      10.5,
      9.99,
      0.5,
      7,
      10,
      30,
      store
    );
  }

  static createFoodProduct(productName, productId, mrp, sellingPrice, isVeg, prepTimeMins, availableStock, restaurant) {
    return new FoodProduct(
      productId,
      productName,
      mrp,
      sellingPrice,
      isVeg,
      prepTimeMins,
      availableStock,
      restaurant
    );
  }
}

SeedData.store101 = SeedData.createStore("Fresh Picks", "store101");
SeedData.store102 = SeedData.createStore("Natural Choice", "store102");
SeedData.stores = [SeedData.store101, SeedData.store102];

SeedData.rest101 = SeedData.createRestaurant("Tasty Bites", "rest101");

SeedData.user101 = SeedData.createUser("user101", "John", "Doe");
SeedData.user102 = SeedData.createUser("user102", "Rachel", "Zane");
SeedData.users = [SeedData.user101, SeedData.user102];

SeedData.cartForUsers = new Map([
  ["user101", SeedData.createCartForUser("cart101", SeedData.user101)],
  ["user102", SeedData.createCartForUser("cart102", SeedData.user102)],
]);

SeedData.groceryProducts = [
  SeedData.createGroceryProduct("Wheat Bread", "product101", SeedData.store101),
  SeedData.createGroceryProduct("Spinach", "product102", SeedData.store101),
  SeedData.createGroceryProduct("Crackers", "product103", SeedData.store101),
];

SeedData.foodProducts = [
  SeedData.createFoodProduct("Margherita Pizza", "food201", 8.0, 7.5, true, 20, 50, SeedData.rest101),
  SeedData.createFoodProduct("Veg Burger", "food202", 5.0, 4.5, true, 15, 40, SeedData.rest101),
  SeedData.createFoodProduct("Pasta Alfredo", "food203", 7.0, 6.5, true, 25, 30, SeedData.rest101),
];

module.exports = SeedData;
