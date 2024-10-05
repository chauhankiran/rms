module.exports = {
  index: (req, res, next) => {
    console.log("currentUser.type:", req.session.currentUser.type);
    res.render("admin/index", { title: "Admin" });
  },
};
