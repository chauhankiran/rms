module.exports = {
  index: (req, res, next) => {
    console.log("currentUser.type:", req.session.currentUser.type);
    return res.render("admin/index", { title: "Admin" });
  },
};
