module.exports = {
    index: (req, res, next) => {
        return res.render("admin/index", { title: "Admin" });
    },

    refs: (req, res, next) => {
        return res.render("admin/refs", { title: "Manage Refs" });
    },
};
