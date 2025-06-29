module.exports = {
    index: (req, res, next) => {
        return res.render("admin/index", { title: "Admin" });
    },

    labels: (req, res, next) => {
        return res.render("admin/labels", { title: "Manage Labels" });
    },

    refs: (req, res, next) => {
        return res.render("admin/refs", { title: "Manage Refs" });
    },
};
