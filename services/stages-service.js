const sql = require("../db/sql");

module.exports = {
    // Find many stages.
    find: async (opt) => {
        const { orgId } = opt;

        return await sql`
            SELECT
                *
            FROM
                stages
            WHERE
                "orgId" = ${orgId} and
                life = 1
        `;
    },
};
