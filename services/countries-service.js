const sql = require("../db/sql");

module.exports = {
    // Find many countries.
    find: async (opt) => {
        const { orgId } = opt;

        return await sql`
            SELECT
                *
            FROM
                countries
            WHERE
                "orgId" = ${orgId} and
                life = 1
        `;
    },
};
