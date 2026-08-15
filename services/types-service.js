const sql = require("../db/sql");

module.exports = {
    // Find many types.
    find: async (opt) => {
        const { orgId } = opt;

        return await sql`
            SELECT
                *
            FROM
                types
            WHERE
                "orgId" = ${orgId} and
                life = 1
        `;
    },
};
