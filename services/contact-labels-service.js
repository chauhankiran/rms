const sql = require("../db/sql");

module.exports = {
    find: async () => {
        return await sql`
            SELECT
                name
            FROM
                "contactLabels"
            WHERE
                "isActive" = TRUE
        `;
    },
};
