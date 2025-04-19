const sql = require("../db/sql");

module.exports = {
    find: async () => {
        return await sql`
            SELECT
                name
            FROM
                "taskLabels"
            WHERE
                "isActive" = TRUE
        `;
    },
};
