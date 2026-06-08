const Cart = require("../domain/cart");
const GroceryStore = require("../domain/groceryStore");
const User = require("../domain/user");
const GroceryProduct = require("../domain/groceryProduct");
const Restaurant = require("../domain/restaurant");
const FoodProduct = require("../domain/foodProduct");
const Store = require("../domain/store");
const EletronicProduct = require("../domain/eletronicProduct");
const MedecineProduct = require("../domain/medecineProduct");
const HouseholdProduct = require("../domain/householdProduct");

class SeedData {
  static createCartForUser(user, cartId) {
    return new Cart(cartId, null, user);
  }

  static createStore(outletName, description, storeId) {
    return new Store(outletName, description, storeId);
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

  static createElectronicProduct(productName, productId, store) {
    return new EletronicProduct(
      productId,
      productName,
      499.99, // mrp
      449.99, // sellingPrice
      store, // store reference
    );
  }

  static createMedecineProduct(productName, productId, store) {
    return new MedecineProduct(
      productId,
      productName,
      19.99, // mrp
      17.99, // sellingPrice
      store, // store reference
    );
  }

  static createHouseholdProduct(productName, productId, store) {
    return new HouseholdProduct(
      productId,
      productName,
      29.99, // mrp
      24.99, // sellingPrice
      store, // store reference
    );
  }

  static createRestaurant(outletName, restaurantId) {
    return new Restaurant(outletName, "Local restaurant", restaurantId);
  }

  static createFoodProduct(
    productName,
    productId,
    restaurant,
    available = true,
  ) {
    return new FoodProduct(
      productId,
      productName,
      12.5, // mrp
      10.99, // sellingPrice
      restaurant,
      available,
    );
  }
}

SeedData.store101 = SeedData.createStore(
  "Fresh Picks",
  "Premium grocery store",
  "store101",
);
SeedData.store102 = SeedData.createStore(
  "Natural Choice",
  "Health-focused grocery store",
  "store102",
);
SeedData.stores = [SeedData.store101, SeedData.store102];
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
  SeedData.createGroceryProduct("Almond Milk", "product201", SeedData.store102),
  SeedData.createGroceryProduct(
    "Greek Yogurt",
    "product202",
    SeedData.store102,
  ),
];
SeedData.eletronicProducts = [
  SeedData.createElectronicProduct(
    "Wireless Headphones",
    "product301",
    SeedData.store101,
  ),
  SeedData.createElectronicProduct(
    "Smart Watch",
    "product302",
    SeedData.store101,
  ),
];
SeedData.medecineProducts = [
  SeedData.createMedecineProduct(
    "Pain Reliever",
    "product401",
    SeedData.store101,
  ),
  SeedData.createMedecineProduct(
    "Cough Syrup",
    "product402",
    SeedData.store101,
  ),
];
SeedData.householdProducts = [
  SeedData.createHouseholdProduct("Dish Soap", "product501", SeedData.store101),
  SeedData.createHouseholdProduct(
    "Laundry Detergent",
    "product502",
    SeedData.store101,
  ),
];

// Register each product with its store so the store knows its inventory.
SeedData.groceryProducts.forEach((product) => {
  product.store.inventory.add(product);
});
SeedData.eletronicProducts.forEach((product) => {
  product.store.inventory.add(product);
});
SeedData.medecineProducts.forEach((product) => {
  product.store.inventory.add(product);
});
SeedData.householdProducts.forEach((product) => {
  product.store.inventory.add(product);
});

SeedData.restaurant101 = SeedData.createRestaurant("Pizza Palace", "rest101");
SeedData.restaurants = [SeedData.restaurant101];

SeedData.foodProducts = [
  SeedData.createFoodProduct(
    "Margherita Pizza",
    "food101",
    SeedData.restaurant101,
  ),
  SeedData.createFoodProduct(
    "Pepperoni Pizza",
    "food102",
    SeedData.restaurant101,
  ),
  SeedData.createFoodProduct(
    "Truffle Pizza",
    "food103",
    SeedData.restaurant101,
    false, // currently unavailable
  ),
];

SeedData.users = [SeedData.user101, SeedData.user102];

module.exports = SeedData;
