const sql = require("../../db/sql");

module.exports = {
    find: async (isActive) => {
        return await sql`
            SELECT
                name
            FROM
                modules
            WHERE
                ${isActive ? sql`"isActive" = true` : sql``}
        `;
    },
};
