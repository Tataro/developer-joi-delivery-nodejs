const ValidationError = require("../domain/errors/validationError");
const RestaurantNotFoundError = require("../domain/errors/restaurantNotFoundError");
const SeedData = require("../seedData/seedData");

const restaurantService = {
  findRestaurant(restaurantId) {
    if (!restaurantId) {
      throw new ValidationError("restaurantId is required");
    }
    const restaurant = SeedData.restaurants.find(
      (r) => r.outletId === restaurantId,
    );
    if (!restaurant) {
      throw new RestaurantNotFoundError(
        `Restaurant with id ${restaurantId} not found`,
      );
    }
    return restaurant;
  },

  // Menu items are derived from SeedData.foodProducts (filtered by restaurant),
  // never read off restaurant.menu — keeping that Set empty avoids the
  // restaurant -> menu -> product -> restaurant circular reference in res.json().
  menuFor(restaurantId) {
    return SeedData.foodProducts.filter(
      (p) => p.restaurant && p.restaurant.outletId === restaurantId,
    );
  },

  getMenu(restaurantId) {
    const restaurant = this.findRestaurant(restaurantId);
    return {
      restaurantId: restaurant.outletId,
      name: restaurant.name,
      cuisineType: restaurant.cuisineType,
      menu: this.menuFor(restaurantId),
    };
  },

  /**
   * Restaurant equivalent of inventory health. Food is made to order, so there
   * is no counted stock — health is measured by menu availability instead.
   */
  getMenuAvailability(restaurantId) {
    this.findRestaurant(restaurantId);
    const items = this.menuFor(restaurantId);

    let availableItems = 0,
      unavailableItems = 0;
    for (const item of items) {
      if (item.isAvailable) availableItems++;
      else unavailableItems++;
    }

    return {
      restaurantId,
      totalItems: items.length,
      availableItems,
      unavailableItems,
    };
  },
};

module.exports = restaurantService;
