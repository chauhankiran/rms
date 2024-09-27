module.exports = {
  index: (req, res, next) => {
    console.log(req.session);
    res.render("home", { title: "Home" });
  },
};
