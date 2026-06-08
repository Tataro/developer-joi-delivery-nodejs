const express = require("express");
const cartController = require("./controllers/cartController");
const inventoryController = require("./controllers/inventoryController");
const orderController = require("./controllers/orderController");
const cartService = require("./services/cartService");
const SeedData = require("./seedData/seedData");

const app = express();
app.use(express.json());

// Initialize cart service with seed data
SeedData.cartForUsers.forEach((cart, userId) => {
  cartService.userCarts.set(userId, cart);
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.post("/cart/product", (req, res) => {
  console.log("POST /cart/product route hit");
  cartController.addProductToCart(req, res);
});

app.post("/order", (req, res) => {
  console.log("POST /order route hit");
  orderController.createOrder(req, res);
});

app.get("/cart/view", (req, res) => {
  console.log("GET /cart/view route hit");
  cartController.viewCart(req, res);
});

app.get("/inventory/health", (req, res) => {
  console.log("GET /inventory/health route hit");
  inventoryController.fetchStoreInventoryHealth(req, res);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🚀 app listening on port ${port}`);
});
