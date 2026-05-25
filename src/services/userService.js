const SeedData = require("../seedData/seedData");

const userService = {
  fetchUserById(userId) {
    return SeedData.users.find((user) => userId === user.userId) || null;
  },
};

module.exports = userService;
