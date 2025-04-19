const sql = require("../db/sql");

module.exports = {
    find: async (userId) => {
        return await sql`
            SELECT
                id,
                name
            FROM
                "taskViews"
            WHERE
                "userId" = ${userId}
            ORDER BY
                seq ASC
        `;
    },
    create: async ({ userId, field, seq }) => {
        return await sql`
            INSERT INTO "taskViews" (
                "userId", 
                "name", 
                "seq"
            ) VALUES (
                ${userId}, 
                ${field}, 
                ${seq}
            )
        `;
    },
    destroy: async (userId) => {
        return await sql`
            DELETE FROM
                "taskViews"
            WHERE
                "userId" = ${userId}
        `;
    },

    pluck: async (columns) => {
        return await sql`
            SELECT
                ${sql(columns)}
            FROM
                "taskViews"
        `;
    },
};
