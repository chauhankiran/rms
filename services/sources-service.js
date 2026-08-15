const sql = require("../db/sql");

module.exports = {
    // Find many sources.
    find: async (opt) => {
        const { orgId } = opt;

        return await sql`
            SELECT
                *
            FROM
                sources
            WHERE
                "orgId" = ${orgId} and
                life = 1
        `;
    },
};
