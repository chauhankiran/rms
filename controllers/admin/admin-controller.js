module.exports = {
    index: (req, res, next) => {
        return res.render("admin/index", { title: "Admin" });
    },
};
