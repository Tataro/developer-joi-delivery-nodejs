const Outlet = require("./outlet");

class Restaurant extends Outlet {
  constructor(name, description, outletId) {
    super(name, description, outletId);
    this.menu = new Set();
  }
}

module.exports = Restaurant;
