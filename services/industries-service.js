const sql = require("../db/sql");

module.exports = {
    // Find many industries.
    find: async (opt) => {
        const { orgId } = opt;

        return await sql`
            SELECT
                *
            FROM
                industries
            WHERE
                "orgId" = ${orgId} and
                life = 1
        `;
    },
};
