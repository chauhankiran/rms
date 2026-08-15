const sql = require("../db/sql");

module.exports = {
    // Find many statuses.
    find: async (opt) => {
        const { orgId } = opt;

        return await sql`
            SELECT
                *
            FROM
                statuses
            WHERE
                "orgId" = ${orgId} and
                life = 1
        `;
    },
};
