const sql = require("../db/sql");

module.exports = {
    // Find many states.
    find: async (opt) => {
        const { orgId } = opt;

        return await sql`
            SELECT
                *
            FROM
                states
            WHERE
                "orgId" = ${orgId} and
                life = 1
        `;
    },
};
