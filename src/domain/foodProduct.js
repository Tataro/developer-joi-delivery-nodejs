const Product = require("./product");

class FoodProduct extends Product {
  constructor(
    productId,
    productName,
    mrp,
    sellingPrice,
    isVeg,
    prepTimeMins,
    availableStock,
    restaurant,
    discount = 0
  ) {
    super(productId, productName, mrp);
    this.sellingPrice = sellingPrice;
    this.isVeg = isVeg;
    this.prepTimeMins = prepTimeMins;
    this.availableStock = availableStock;
    this.restaurant = restaurant;
    this.discount = discount;
  }
}

module.exports = FoodProduct;
