const usersService = require("../services/usersService");

module.exports = {
  index: async (req, res, next) => {
    try {
      const users = await usersService.find();

      return res.render("users/index", { title: "Users", users });
    } catch (err) {
      next(err);
    }
  },
};
